'use client';

import { useEffect } from 'react';
import { QuestionSection } from '@/types/questions';
import { DocumentEditor } from '@/components/common/DocumentEditor';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';

interface LORFormProps {
  type: 'professor' | 'company' | 'internship';
  questionSections: QuestionSection[];
  title: string;
  description: string;
  id?: string;
}

export function LORForm({ questionSections, title, id }: LORFormProps) {
  
  const {
    data: document,
    isLoading,
    execute: fetchDocument,
  } = useApi(() => {
    if (id) {
      return documentsApi.getById(id);
    }
    return Promise.resolve(null);
  });

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  // Flatten questions and maintain category mapping
  const allQuestions = questionSections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      category: section.id,
    }))
  );

  const categories = questionSections.reduce(
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


  if (!id) {
    return <div>No LOR ID provided</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DocumentEditor
      title={title}
      questions={allQuestions}
      categories={categories}
      initialAnswers={initialAnswers}
      documentId={id}
    />
  );
}
