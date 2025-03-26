import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    // Get user session
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get the user from the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user's subscription details
    return NextResponse.json({
      subscription: user.subscription || null,
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
} 