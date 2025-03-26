'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UniversitySelect from '@/components/common/UniversitySelect/UniversitySelect';
import styles from './NewUniversitySopForm.module.scss';

export function NewUniversitySopForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    universityId: '',
    program: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUniversityChange = (university: any) => {
    setFormData({
      ...formData,
      universityId: university._id,
    });
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      program: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.universityId) {
      setError('Please select a university');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/documents/sop/university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create university SOP');
      }
      
      const data = await response.json();
      
      // Redirect to the new SOP page
      router.push(`/documents/sop/university/${data.universitySop._id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New University SOP</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <UniversitySelect
          value={formData.universityId}
          onChange={handleUniversityChange}
          required
          label="Select University"
        />
        
        <div className={styles.formGroup}>
          <label htmlFor="program">Program/Degree</label>
          <input
            type="text"
            id="program"
            value={formData.program}
            onChange={handleProgramChange}
            placeholder="e.g., Master of Science in Computer Science"
            className={styles.input}
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !formData.universityId}
          >
            {loading ? 'Creating...' : 'Create SOP'}
          </button>
        </div>
      </form>
    </div>
  );
} 