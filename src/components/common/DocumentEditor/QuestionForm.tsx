'use client';

import { Question } from '@/types/questions';

import { useState } from 'react';

import styles from './QuestionForm.module.scss';

interface QuestionFormProps {
  question: Question;
  initialAnswer?: string;
  onSave: (answer: string) => Promise<void>;
  isSaving?: boolean;
}

export function QuestionForm({ question, initialAnswer, onSave, isSaving = false }: QuestionFormProps) {
  const [answer, setAnswer] = useState(initialAnswer || '');
  const [localIsSaving, setLocalIsSaving] = useState(false);

  const handleSave = async () => {
    setLocalIsSaving(true);
    try {
      await onSave(answer);
    } finally {
      setLocalIsSaving(false);
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
          disabled={localIsSaving || isSaving || !answer.trim()}
          className={styles.saveButton}
        >
          {localIsSaving || isSaving ? 'Saving...' : 'Save Answer'}
        </button>
      </div>
    </div>
  );
}
