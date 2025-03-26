'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dropdown } from '@/components/common/Dropdown';
import { useApi } from '@/hooks/useApi';
import { documentsApi } from '@/lib/api/documents';
import { IDocument } from '@/models/Document';
import { LORCreationModal } from '@/components/lor/LORCreationModal/LORCreationModal';
import styles from './LORList.module.scss';

interface DocumentWithProgress extends IDocument {
  progress?: {
    completed: number;
    total: number;
  };
}

interface LORListProps {
  defaultSection?: 'professor' | 'company' | 'internship';
}

export function LORList({ defaultSection }: LORListProps) {
  const [activeSection, setActiveSection] = useState<string>(defaultSection || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLorType, setSelectedLorType] = useState<'professor' | 'company' | 'internship'>('professor');

  const {
    data: lors,
    isLoading,
    error,
    execute: fetchLORs
  } = useApi(() => documentsApi.getAll({ 
    type: activeSection === 'all' 
      ? ['lor-professor', 'lor-company', 'lor-internship'] 
      : `lor-${activeSection}`
  }));

  useEffect(() => {
    fetchLORs();
  }, [activeSection]);

  useEffect(() => {
    if (defaultSection) {
      setActiveSection(defaultSection);
    }
  }, [defaultSection]);

  const lorTypes = [
    { type: 'professor', title: 'Professor Recommendations' },
    { type: 'company', title: 'Company Recommendations' },
    { type: 'internship', title: 'Internship Recommendations' },
  ];

  const openModal = (type: 'professor' | 'company' | 'internship') => {
    setSelectedLorType(type);
    setIsModalOpen(true);
  };

  const lorOptions = [
    { 
      label: 'Professor LOR', 
      value: 'professor', 
      onClick: () => openModal('professor')
    },
    { 
      label: 'Company LOR', 
      value: 'company', 
      onClick: () => openModal('company')
    },
    { 
      label: 'Internship LOR', 
      value: 'internship', 
      onClick: () => openModal('internship')
    },
  ];

  // Helper function to get LOR type from document type
  const getLorType = (docType: string | undefined): string => {
    if (!docType) return 'professor'; // Default if type is undefined
    if (docType.includes('professor')) return 'professor';
    if (docType.includes('company')) return 'company';
    if (docType.includes('internship')) return 'internship';
    if (docType.includes('manager')) return 'company'; // Fallback for manager type
    return 'professor'; // Default fallback
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Letters of Recommendation</h1>
          <p>Manage your recommendation letters from professors, companies, and internships</p>
        </div>
        <Dropdown
          label="Create New LOR"
          options={lorOptions}
          buttonClassName={styles.createButton}
        />
      </header>

      <nav className={styles.nav}>
        <button
          onClick={() => setActiveSection('all')}
          className={clsx(styles.navButton, activeSection === 'all' && styles.active)}
        >
          All
        </button>
        {lorTypes.map(({ type, title }) => (
          <button
            key={type}
            onClick={() => setActiveSection(type)}
            className={clsx(styles.navButton, activeSection === type && styles.active)}
          >
            {title}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className={styles.loading}>Loading letters of recommendation...</div>
      ) : error ? (
        <div className={styles.error}>Failed to load LORs. Please try again.</div>
      ) : lors && lors.length > 0 ? (
        <div className={styles.grid}>
          {(lors as DocumentWithProgress[]).map((lor) => {
            const lorType = getLorType(lor.type);
            const recommenderName = lor.metadata?.recommender?.name || 'Recommender';
            const institution = lor.metadata?.recommender?.institution || lor.title;
            
            return (
              <Link 
                key={lor._id} 
                href={`/documents/lor/${lorType}/${lor._id}`} 
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <h3>{recommenderName}</h3>
                  <p>{institution}</p>
                  <div className={styles.status}>
                    <span className={`${styles.badge} ${styles[lor.status]}`}>{lor.status}</span>
                  </div>
                  <div className={styles.stats}>
                    <div>
                      <span className={styles.count}>
                        {lor.progress?.completed || 0}/{lor.progress?.total || 0}
                      </span>
                      <span className={styles.label}>questions completed</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${((lor.progress?.completed || 0) / (lor.progress?.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>You haven't created any letters of recommendation yet.</p>
          <Dropdown
            label="Create Your First LOR"
            options={lorOptions}
            buttonClassName={styles.emptyButton}
          />
        </div>
      )}

      <LORCreationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lorType={selectedLorType}
      />
    </div>
  );
}
