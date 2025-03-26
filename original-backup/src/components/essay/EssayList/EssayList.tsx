'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';
import { IDocument } from '@/models/Document';
import { Button } from '@/components/common/Button/Button';
import { UniversityDocumentModal } from '@/components/common/UniversityDocumentModal/UniversityDocumentModal';
import styles from './EssayList.module.scss';

interface DocumentWithProgress extends IDocument {
  progress?: {
    completed: number;
    total: number;
  };
}

export function EssayList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    data: essays,
    isLoading,
    error,
    execute: fetchEssays
  } = useApi(() => documentsApi.getAll({ type: 'essay' }));

  useEffect(() => {
    fetchEssays();
  }, []);
  
  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>University Essays</h1>
          <p>Create and manage your university-specific essays</p>
        </div>
        <Button 
          onClick={openModal}
          className={styles.createButton}
        >
          Add University Essay
        </Button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading essays...</div>
      ) : error ? (
        <div className={styles.error}>Failed to load essays. Please try again.</div>
      ) : essays && essays.length > 0 ? (
        <div className={styles.grid}>
          {(essays as DocumentWithProgress[]).map((essay) => (
            <Link key={essay._id} href={`/documents/essay/${essay._id}`} className={styles.card}>
              <div className={styles.cardContent}>
                <h2>{essay.metadata?.university?.name || 'University Essay'}</h2>
                <p>{essay.metadata?.university?.program || essay.title}</p>
                <div className={styles.status}>
                  <span className={`${styles.badge} ${styles[essay.status]}`}>{essay.status}</span>
                </div>
                <div className={styles.stats}>
                  <div>
                    <span className={styles.count}>
                      {essay.progress?.completed || 0}/{essay.progress?.total || 0}
                    </span>
                    <span className={styles.label}>questions completed</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${((essay.progress?.completed || 0) / (essay.progress?.total || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>You haven't created any essays yet.</p>
          <Button 
            onClick={openModal}
            className={styles.emptyButton}
          >
            Create Your First Essay
          </Button>
        </div>
      )}
      
      <UniversityDocumentModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        documentType="essay"
      />
    </div>
  );
}
