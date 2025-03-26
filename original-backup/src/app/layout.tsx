import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "@/styles/scss/globals.scss";
import { MainLayout } from '@/components/layout/MainLayout';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "WriteFast - AI Writing Assistant",
  description: "AI-powered writing assistant for university applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoMono.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <AuthProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
