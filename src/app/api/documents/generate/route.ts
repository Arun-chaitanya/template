import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { llmService } from '@/lib/services/llm-service';
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
    const { documentId } = data;

    // Get the document
    const document = await Document.findOne({
      _id: documentId,
      userId: session.user.id,
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    // Generate content using LLM
    const content = await llmService.generateDocumentContent(document);

    // Update the document with generated content
    const updatedDocument = await Document.findOneAndUpdate(
      { _id: documentId, userId: session.user.id },
      { 
        generatedContent: content,
        lastUpdated: new Date(),
        status: 'draft' 
      },
      { new: true }
    );

    return NextResponse.json(updatedDocument.generatedContent);
  } catch (error) {
    console.error('Error generating document content:', error);
    return NextResponse.json(
      { error: 'Failed to generate document content' },
      { status: 500 }
    );
  }
} 