'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { documentsApi } from '@/lib/api/documents';
import UniversitySelect from '@/components/common/UniversitySelect/UniversitySelect';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import styles from './UniversityDocumentModal.module.scss';
import { University } from '@/lib/api/universities';
import mongoose from 'mongoose';

interface UniversityDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'sop-university' | 'essay';
  modalTitle?: string;
}

export function UniversityDocumentModal({ 
  isOpen, 
  onClose, 
  documentType,
  modalTitle,
}: UniversityDocumentModalProps) {
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [program, setProgram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUniversityChange = (selectedUniversity: University) => {
    setUniversity(selectedUniversity);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university?._id || !program) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create a new document
      const title = 
        `${documentType === 'sop-university' ? 'SOP' : 'Essay'} for ${university.name} - ${program}`;
      
      const newDocument = await documentsApi.create({
        type: documentType,
        title: title,
        status: 'draft',
        metadata: {
          university: {
            name: university.name,
            program: program,
            deadline: new Date(),
          }
        },
        universityId: new mongoose.Types.ObjectId(university._id),
        program,
        answers: []
      });

      // Close the modal and redirect to the document page
      onClose();
      router.push(`/documents/${documentType === 'sop-university' ? 'sop/university' : 'essay'}/${newDocument._id}`);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUniversity(null);
      setProgram('');
      setError(null);
    }
  }, [isOpen]);

  const getDefaultModalTitle = () => {
    return documentType === 'sop-university' 
      ? 'Create University SOP' 
      : 'Create University Essay';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle || getDefaultModalTitle()}
    >
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <UniversitySelect 
            value={university?._id || ''}
            onChange={handleUniversityChange}
            required
            label="Select University"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="program">Program</label>
          <input
            type="text"
            id="program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="e.g. Master of Computer Science"
            required
          />
        </div>

        <div className={styles.formActions}>
          <Button 
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button 
            variant='primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 