import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
    },
    profile: {
      image: String,
      bio: String,
      location: String,
      website: String,
      company: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);

export interface IUser {
  email: string;
  name: string;
  subscription?: {
    plan?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    cancelAtPeriodEnd?: boolean;
  };
  profile?: {
    image?: string;
    bio?: string;
    location?: string;
    website?: string;
    company?: string;
    phone?: string;
  };
} 