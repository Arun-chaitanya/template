'use client';

import { useEffect } from 'react';
import { universitySOPQuestions } from '@/data/universitySOPQuestions';
import { Question } from '@/types/questions';
import { DocumentEditor } from '@/components/common/DocumentEditor';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';
import styles from './UniversitySOPEditor.module.scss';

interface UniversitySOPEditorProps {
  universityId?: string;
}

export function UniversitySOPEditor({ universityId }: UniversitySOPEditorProps) {
  
  const {
    data: document,
    isLoading,
    execute: fetchDocument,
  } = useApi(() => {
    if (universityId) {
      return documentsApi.getById(universityId);
    }
    return Promise.resolve(null);
  });

  useEffect(() => {
    fetchDocument();
  }, [universityId]);

  // Flatten questions and maintain category mapping
  const allQuestions = universitySOPQuestions.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      category: section.id, // Add section id as category
    }))
  );

  // Create categories mapping
  const categories = universitySOPQuestions.reduce(
    (acc, section) => ({
      ...acc,
      [section.id]: {
        title: section.title,
        description: section.description,
      },
    }),
    {}
  );

  const initialAnswers = document?.answers?.reduce(
    (acc, { questionId, answer }) => ({
      ...acc,
      [questionId]: answer
    }), 
    {}
  ) || {};

  if (!universityId) {
    return <div>No university ID provided</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <DocumentEditor
      title={universityId ? 'Edit University SOP' : 'New University SOP'}
      questions={allQuestions as Question[]}
      categories={categories}
      initialAnswers={initialAnswers}
      documentId={universityId}
    />
  );
}
