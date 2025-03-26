'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { documentsApi } from '@/lib/api/documents';
import styles from './GenerateContentButton.module.scss';
import { Question } from '@/types/questions';
import { IDocument } from '@/models/Document';

interface GenerateContentButtonProps {
  documentId: string;
  questions: Question[];
  answers?: Record<string, string>;
  onSuccess: (document: IDocument) => void;
}

export function GenerateContentButton({ 
  documentId, 
  questions, 
  answers = {},
  onSuccess 
}: GenerateContentButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Check if all questions have answers
  const areAllQuestionsAnswered = questions.every(q => !!answers[q.id]);
  
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');
      
      const document = await documentsApi.generateContent(documentId, questions);
      onSuccess(document);
      
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !areAllQuestionsAnswered}
        isLoading={isGenerating}
        loadingText="Generating..."
      >
        {areAllQuestionsAnswered ? 'Generate with AI' : 'Fill all questions to generate'}
      </Button>
    </div>
  );
} 