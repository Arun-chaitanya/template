import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getUserSession() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        subscription: session.user.subscription,
      },
    };
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
} 