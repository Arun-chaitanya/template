import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscription?: {
        plan?: string;
        isActive?: boolean;
        startDate?: Date;
        endDate?: Date;
      };
      profile?: {
        university?: string;
        department?: string;
        graduationYear?: number;
        country?: string;
      };
    };
  }
} 