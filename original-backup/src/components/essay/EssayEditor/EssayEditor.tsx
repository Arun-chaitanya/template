'use client';

import { useEffect } from 'react';
import { essayQuestions } from '@/data/essayQuestions';
import { Question } from '@/types/questions';
import { DocumentEditor } from '@/components/common/DocumentEditor';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

interface EssayEditorProps {
  essayId?: string;
}

export function EssayEditor({ essayId }: EssayEditorProps) {
  const router = useRouter();
  
  const {
    data: document,
    isLoading,
    execute: fetchDocument,
  } = useApi(() => {
    if (essayId) {
      return documentsApi.getById(essayId);
    }
    return Promise.resolve(null);
  });

  useEffect(() => {
    if (essayId) {
      fetchDocument();
    }
  }, [essayId]);

  // Flatten questions and maintain category mapping
  const allQuestions = essayQuestions.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      category: section.id,
    }))
  );

  // Create categories mapping
  const categories = essayQuestions.reduce(
    (acc, section) => ({
      ...acc,
      [section.id]: {
        title: section.title,
        description: section.description,
      },
    }),
    {}
  );

  const handleSave = async (questionId: string, answer: string) => {
    try {
      const answersArray = [{ questionId, answer }];
      
      if (essayId) {
        // Update existing document
        await documentsApi.update(essayId, {
          answers: [
            ...(document?.answers?.filter(a => a.questionId !== questionId) || []),
            { questionId, answer }
          ],
          lastUpdated: new Date()
        });
      } else {
        // Create new document
        const newDocument = await documentsApi.create({
          type: 'essay',
          title: 'Essay',
          answers: answersArray,
          status: 'draft'
        });
        router.push(`/documents/essay/${newDocument._id}`);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const initialAnswers = document?.answers?.reduce(
    (acc, { questionId, answer }) => ({
      ...acc,
      [questionId]: answer
    }), 
    {}
  ) || {};

  if (!essayId) {
    return <div>No essay ID provided</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <DocumentEditor
        title={essayId ? 'Edit Essay' : 'New Essay'}
        questions={allQuestions as Question[]}
        categories={categories}
        initialAnswers={initialAnswers}
        onSave={handleSave}
        documentId={essayId}
      />
  );
}
