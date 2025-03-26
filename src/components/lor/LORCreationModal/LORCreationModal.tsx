'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button/Button';
import { documentsApi } from '@/lib/api/documents';
import styles from './LORCreationModal.module.scss';
import { Modal } from '@/components/common/Modal';

interface LORCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lorType: 'professor' | 'company' | 'internship';
}

export function LORCreationModal({ isOpen, onClose, lorType }: LORCreationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    institution: '',
    email: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.institution) {
      setError('Recommender name and institution are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the LOR document
      const document = await documentsApi.create({
        type: `lor-${lorType}` as any,
        title: `${formData.name} - ${formData.institution}`,
        metadata: {
          recommender: {
            name: formData.name,
            title: formData.title,
            institution: formData.institution,
            email: formData.email,
          }
        },
        status: 'draft',
      });
      
      // Navigate to the new document
      router.push(`/documents/lor/${lorType}/${document._id}`);
    } catch (err) {
      console.error('Error creating LOR:', err);
      setError('Failed to create LOR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (lorType) {
      case 'professor': return 'Create Professor Recommendation';
      case 'company': return 'Create Company Recommendation';
      case 'internship': return 'Create Internship Recommendation';
      default: return 'Create Recommendation';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Recommender Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Dr. John Smith"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="title">Recommender Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Professor of Computer Science"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="institution">Institution/Company*</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g., Stanford University"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Recommender Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., john.smith@university.edu"
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create LOR
          </Button>
        </div>
      </form>
    </Modal>
  );
} 