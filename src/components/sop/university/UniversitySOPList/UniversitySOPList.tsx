'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/common/Button/Button';
import { UniversityDocumentModal } from '@/components/common/UniversityDocumentModal/UniversityDocumentModal';
import styles from './UniversitySOPList.module.scss';
import { IDocument } from '@/models/Document';

interface DocumentWithProgress extends IDocument {
  progress?: {
    completed: number;
    total: number;
  };
}

export function UniversitySOPList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    data: universitySops,
    isLoading,
    error,
    execute: fetchUniversitySops
  } = useApi(() => documentsApi.getAll({ type: 'sop-university' }));

  useEffect(() => {
    fetchUniversitySops();
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
          <h1>University SOPs</h1>
          <p>Create and manage your SOPs for different universities</p>
        </div>
        <Button 
          onClick={openModal} 
          variant="primary"
        >
          Add University
        </Button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading university SOPs...</div>
      ) : error ? (
        <div className={styles.error}>Failed to load university SOPs. Please try again.</div>
      ) : universitySops && universitySops.length > 0 ? (
        <div className={styles.grid}>
          {(universitySops as DocumentWithProgress[]).map((uni) => (
            <Link key={uni._id} href={`/documents/sop/university/${uni._id}`} className={styles.card}>
              <div className={styles.cardContent}>
                <h2>{uni.metadata?.university?.name}</h2>
                <p>{uni.metadata?.university?.program}</p>
                <div className={styles.status}>
                  <span className={`${styles.badge} ${styles[uni.status]}`}>{uni.status}</span>
                </div>
                <div className={styles.stats}>
                  <div>
                    <span className={styles.count}>
                      {uni.progress?.completed || 0}/{uni.progress?.total || 0}
                    </span>
                    <span className={styles.label}>questions completed</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${((uni.progress?.completed || 0) / (uni.progress?.total || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>You haven't created any university SOPs yet.</p>
          <Button 
            onClick={openModal} 
            variant="primary"
          >
            Create Your First University SOP
          </Button>
        </div>
      )}

      <UniversityDocumentModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        documentType="sop-university"
      />
    </div>
  );
}
