import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Document from '@/models/Document';

// Get a single document by ID
export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { documentId } = params;

    const document = await Document.findOne({
      _id: documentId,
      userId: session.user.id,
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// Update a document
export async function PATCH(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { documentId } = params;
    const data = await req.json();

    // Ensure the user can only update their own documents
    const document = await Document.findOneAndUpdate(
      { _id: documentId, userId: session.user.id },
      { ...data, lastUpdated: new Date() },
      { new: true }
    );

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// Delete a document
export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { documentId } = params;

    // Ensure the user can only delete their own documents
    const document = await Document.findOneAndDelete({
      _id: documentId,
      userId: session.user.id,
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
