'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentsApi } from '@/lib/api/documents';
import { useApi } from '@/hooks/useApi';
import styles from './SOPOverview.module.scss';
import { Button } from '@/components/common/Button/Button';
import { UniversityDocumentModal } from '@/components/common/UniversityDocumentModal/UniversityDocumentModal';

export function SOPOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    data: masterSOPData,
    isLoading: isMasterLoading,
    execute: fetchMasterSOP 
  } = useApi(() => documentsApi.getAll({ type: 'sop-master' }));

  const masterSOP = masterSOPData?.[0] || null;

  const {
    data: universitySops,
    isLoading: isUniLoading,
    execute: fetchUniSOPs
  } = useApi(() => documentsApi.getAll({ type: 'sop-university' }));

  const sops = universitySops ?? [];

  useEffect(() => {
    fetchMasterSOP();
    fetchUniSOPs();
  }, []);

  const isLoading = isMasterLoading || isUniLoading;
  
  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  }

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Statement of Purpose</h1>
        <p>Create and manage your SOPs for different universities</p>
      </header>

      <div className={styles.grid}>
        <Link 
          href="/documents/sop/master"
          className={styles.card}
        >
          <h2>Master SOP</h2>
          <p>Create your foundation SOP that can be adapted for each university</p>
          <div className={styles.status}>
            {isLoading ? (
              <span className={styles.loading}>Loading...</span>
            ) : (
              <span className={`${styles.badge} ${styles[masterSOP?.status || 'notStarted']}`}>
                {masterSOP?.status || 'Not Started'}
              </span>
            )}
          </div>
          <div className={styles.cardLink}>
            {masterSOP ? 'Continue Writing' : 'Start Writing'}
          </div>
        </Link>

        <Link href={`/documents/sop/university`} className={styles.card}>
          <h2>University SOPs</h2>
          <p>Customize your SOP for specific universities</p>
          <div className={styles.stats}>
            {isLoading ? (
              <span className={styles.loading}>Loading...</span>
            ) : (
              <div>
                <span className={styles.count}>{sops.length}</span>
                <span className={styles.label}>Universities</span>
              </div>
            )}
          </div>
          <Button 
            onClick={openModal}
            className={styles.cardLink}
          >
            Add University
          </Button>
        </Link>
      </div>

      <UniversityDocumentModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        documentType="sop-university"
      />
    </div>
  );
}

