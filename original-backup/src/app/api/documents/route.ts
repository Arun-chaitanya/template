import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Document from '@/models/Document';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const document = await Document.create({
      userId: session.user.id,
      ...data,
      lastUpdated: new Date(),
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const university = searchParams.get('university');
    const recommender = searchParams.get('recommender');

    interface DocumentQuery {
      userId: string;
      type?: string | { $in: string[] };
      university?: string;
      recommender?: string;
    }

    const query: DocumentQuery = {
      userId: session.user.id,
    };
    
    // Handle multiple types (comma-separated)
    if (type) {
      const types = type.split(',');
      if (types.length > 1) {
        query.type = { $in: types };
      } else {
        query.type = type;
      }
    }
    
    if (university) query.university = university;
    if (recommender) query.recommender = recommender;

    const documents = await Document.find(query).sort({ lastUpdated: -1 });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
} 