'use client';

import { useEffect } from 'react';
import { DocumentEditor } from '@/components/common/DocumentEditor';
import { masterSOPQuestions, questionCategories } from '@/data/sopQuestions';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';

export function MasterSOPEditor() {
  const {
    data: document,
    isLoading,
    execute: fetchDocument,
  } = useApi(() => documentsApi.getAll({ type: 'sop-master' }));

  useEffect(() => {
    fetchDocument();
  }, []);

  const initialAnswers = document?.[0]?.answers?.reduce(
    (acc, { questionId, answer }) => ({
      ...acc,
      [questionId]: answer
    }), 
    {}
  ) || {};

  if (!document?.[0]?._id) {
    return <div>No document ID provided</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DocumentEditor
      title="Master SOP"
      questions={masterSOPQuestions}
      categories={questionCategories}
      initialAnswers={initialAnswers}
      documentId={document?.[0]?._id}
    />
  );
} 

