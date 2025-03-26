import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthConfig } from "next-auth";
import { User as NextAuthUser, Account, Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb";
import User, { IUser } from "@/models/User";
import connectDB from "./db";
import Email from "@auth/core/providers/nodemailer";

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }: { identifier: string; url: string }) => {
        // Implement your email sending logic here
        console.log('Sending verification email to:', identifier);
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async signIn({ user, account, profile }: { user: NextAuthUser; account: Account | null; profile?: Profile }) {
      await connectDB();
      
      try {
        const existingUser = await User.findOne({ email: user.email })
          .lean()
          .exec();
        
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            profile: {
              image: user.image,
            },
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Still allow sign in even if our custom logic fails
      }
    },
    async session({ session, user }: { session: Session; user: NextAuthUser }) {
      try {
        await connectDB();
        
        if (session?.user) {
          session.user.id = user.id as string;
          
          const dbUser = await User.findOne({ email: user.email })
            .lean()
            .exec() as IUser | null;
            
          if (dbUser) {
            session.user.subscription = dbUser.subscription;
            session.user.profile = dbUser.profile;
          }
        }
      } catch (error) {
        console.error('Error in session callback:', error);
      }
      
      return session;
    },
  },
}; 