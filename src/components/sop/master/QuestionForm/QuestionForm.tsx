'use client';

import { useState } from 'react';
import { SOPQuestion, SOPAnswer } from '@/types/sop';
import styles from './QuestionForm.module.scss';

interface QuestionFormProps {
  question: SOPQuestion;
  initialAnswer?: string;
  onSave: (answer: SOPAnswer) => Promise<void>;
}

export function QuestionForm({ question, initialAnswer, onSave }: QuestionFormProps) {
  const [answer, setAnswer] = useState(initialAnswer || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        questionId: question.id,
        answer,
        lastUpdated: new Date()
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.questionForm}>
      <h3>{question.title}</h3>
      <p className={styles.description}>{question.description}</p>
      
      <div className={styles.editor}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={8}
          maxLength={question.maxLength}
        />
        
        {question.maxLength && (
          <div className={styles.charCount}>
            {answer.length} / {question.maxLength}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleSave}
          disabled={isSaving || !answer.trim()}
          className={styles.saveButton}
        >
          {isSaving ? 'Saving...' : 'Save Answer'}
        </button>
      </div>
    </div>
  );
} 