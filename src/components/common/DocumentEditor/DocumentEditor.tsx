'use client';

import { DocumentEditorProps, ViewMode } from '@/types/questions';
import clsx from 'clsx';
import { useMemo, useState, useEffect } from 'react';
import styles from './DocumentEditor.module.scss';
import { QuestionForm } from './QuestionForm';
import { GenerateContentButton } from '@/components/common/GenerateContentButton/GenerateContentButton';
import { documentsApi } from '@/lib/api/documents';

export interface Category {
  title: string;
  description: string;
}

export function DocumentEditor({
  title,
  questions,
  categories,
  initialAnswers = {},
  documentId,
}: DocumentEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('sidebar');
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(categories)[0]);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the document on mount
  useEffect(() => {
    if (documentId) {
      documentsApi.getById(documentId).then(doc => {
        // Just update the answers from the document instead of storing the whole document
        if (doc.answers && doc.answers.length > 0) {
          const docAnswers = doc.answers.reduce((acc: Record<string, string>, a) => {
            acc[a.questionId] = a.answer;
            return acc;
          }, {});
          setAnswers(docAnswers);
        }
      }).catch(err => {
        console.error('Error fetching document:', err);
      });
    }
  }, [documentId]);

  const categoryProgress = useMemo(() => {
    const progress: Record<string, { completed: number; total: number }> = {};

    Object.keys(categories).forEach((category) => {
      const categoryQuestions = questions.filter((q) => q.category === category);
      const completed = categoryQuestions.filter((q) => answers[q.id]?.trim()).length;
      progress[category] = {
        completed,
        total: categoryQuestions.length,
      };
    });

    return progress;
  }, [answers, categories, questions]);

  const totalProgress = useMemo(
    () => ({
      completed: Object.values(answers).filter((a) => a?.trim()).length,
      total: questions.length,
    }),
    [answers, questions]
  );

  const handleSaveAnswer = async (questionId: string, answer: string) => {
    if (!documentId) return;
    
    setIsSaving(true);
    
    try {
      // Update local state first
      const updatedAnswers = {
        ...answers,
        [questionId]: answer,
      };
      
      setAnswers(updatedAnswers);
      
      // Convert answers object to array format for API
      const answersArray = Object.entries(updatedAnswers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans
      }));
      
      // Update the document with all answers
      await documentsApi.update(documentId, {
        answers: answersArray,
        lastUpdated: new Date()
      });
      
      // No need to update document state anymore
      
    } catch (error) {
      console.error('Failed to save answer:', error);
      // Optionally revert the local state if save fails
    } finally {
      setIsSaving(false);
    }
  };

  const categoryQuestions = questions.filter((q) => q.category === activeCategory);

  const handleViewModeToggle = () => {
    setViewMode((prev) => (prev === 'sidebar' ? 'topnav' : 'sidebar'));
  };

  const scrollToSection = (category: string) => {
    // Use element ID instead of ref
    const element = window.document.getElementById(`section-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderSidebarView = () => (
    <div className={styles.content}>
      <nav className={styles.categories}>
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={clsx(styles.categoryButton, activeCategory === key && styles.active)}
          >
            <div className={styles.categoryHeader}>
              <span className={styles.categoryTitle}>{cat.title}</span>
              <span className={styles.categoryProgress}>
                {categoryProgress[key].completed}/{categoryProgress[key].total}
              </span>
            </div>
            <span className={styles.categoryDesc}>{cat.description}</span>
            <div className={styles.categoryProgressBar}>
              <div
                className={styles.categoryProgressFill}
                style={{
                  width: `${(categoryProgress[key].completed / categoryProgress[key].total) * 100}%`,
                }}
              />
            </div>
          </button>
        ))}
      </nav>

      <div className={styles.questions}>
        {categoryQuestions.map((question) => (
          <QuestionForm
            key={question.id}
            question={question}
            initialAnswer={answers[question.id]}
            onSave={(answer) => handleSaveAnswer(question.id, answer)}
            isSaving={isSaving}
          />
        ))}
      </div>
    </div>
  );

  const renderTopNavView = () => (
    <div className={styles.topNavContent}>
      <nav className={styles.topNav}>
        {Object.entries(categories).map(([key, cat]) => (
          <button key={key} onClick={() => scrollToSection(key)} className={styles.topNavButton}>
            <span className={styles.categoryTitle}>{cat.title}</span>
            <span className={styles.categoryProgress}>
              {categoryProgress[key].completed}/{categoryProgress[key].total}
            </span>
          </button>
        ))}
      </nav>

      <div className={styles.fullQuestionList}>
        {Object.entries(categories).map(([key, cat]) => (
          <section 
            key={key} 
            id={`section-${key}`}
            className={styles.questionSection}
          >
            <h2 className={styles.sectionTitle}>{cat.title}</h2>
            <p className={styles.sectionDesc}>{cat.description}</p>

            {questions
              .filter((q) => q.category === key)
              .map((question) => (
                <QuestionForm
                  key={question.id}
                  question={question}
                  initialAnswer={answers[question.id]}
                  onSave={(answer) => handleSaveAnswer(question.id, answer)}
                  isSaving={isSaving}
                />
              ))}
          </section>
        ))}
      </div>
    </div>
  );

  return (
    <div className={clsx(
      styles.container, 
      viewMode === 'topnav' && styles.listViewContainer
    )}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>{title}</h1>
          <div className={styles.progressInfo}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(totalProgress.completed / totalProgress.total) * 100}%` }}
              />
            </div>
            <span>
              {totalProgress.completed} of {totalProgress.total} questions
            </span>
            <button onClick={handleViewModeToggle} className={styles.viewToggle}>
              {viewMode === 'sidebar' ? 'List View' : 'Section View'}
            </button>
          </div>
        </div>
        <div className={styles.headerActions}>
          <GenerateContentButton 
            documentId={documentId}
            questions={questions}
            answers={answers}
            onSuccess={(doc) => {
              // Update your local state with the new answers
              const documentAnswers: Array<{questionId: string; answer: string}> = doc.answers;
              const newAnswers = documentAnswers.reduce((acc: Record<string, string>, a) => {
                acc[a.questionId] = a.answer;
                return acc;
              }, {});
              setAnswers(newAnswers);
            }}
          />
          {/* Other actions */}
        </div>
      </header>

      <div className={styles.content}>
        {viewMode === 'sidebar' ? renderSidebarView() : renderTopNavView()}
      </div>
    </div>
  );
}

export type { DocumentEditorProps };
