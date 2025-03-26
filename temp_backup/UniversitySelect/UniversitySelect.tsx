'use client';

import { useState, useEffect } from 'react';
import { universitiesApi, University } from '@/lib/api/universities';
import styles from './UniversitySelect.module.scss';

interface UniversitySelectProps {
  value: string;
  onChange: (university: University) => void;
  required?: boolean;
  label?: string;
}

export default function UniversitySelect({
  value,
  onChange,
  required = false,
  label = 'University'
}: UniversitySelectProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUniversity, setCustomUniversity] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const data = await universitiesApi.getAll();
        console.log(data, 'universities');
        setUniversities(data);
      } catch (err) {
        setError('Failed to load universities. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'other') {
      setShowCustomInput(true);
      setCustomUniversity('');
      onChange({_id: '', name: '', country: ''});
    } else {
      setShowCustomInput(false);
      const university = universities.find(u => u._id === selectedValue);
      if (university) {
        onChange(university);
      }
    }
  };

  const handleCustomSubmit = async () => {
    if (!customUniversity || !customCountry) return;
    
    try {
      const newUniversity = await universitiesApi.create({
        name: customUniversity,
        country: customCountry,
        isCustom: true
      });
      
      // Add the new university to the list
      setUniversities([...universities, newUniversity]);
      onChange(newUniversity);
      setShowCustomInput(false);
    } catch (err) {
      setError('Failed to add university. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading universities...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.universitySelect}>
      <label>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      
      <select 
        value={showCustomInput ? 'other' : value} 
        onChange={handleSelectChange}
        required={required}
      >
        <option value="">Select a university</option>
        {
          universities?.map((university) => (
            <option key={university._id} value={university._id}>
              {university.name} ({university.country})
            </option>
          ))
        }
        <option value="other">Other (Add new university)</option>
      </select>
      
      {showCustomInput && (
        <div className={styles.customInput}>
          <div>
            <label>University Name</label>
            <input
              type="text"
              value={customUniversity}
              onChange={(e) => setCustomUniversity(e.target.value)}
              placeholder="Enter university name"
              required
            />
          </div>
          
          <div>
            <label>Country</label>
            <input
              type="text"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
              placeholder="Enter country"
              required
            />
          </div>
          
          <button 
            type="button" 
            onClick={handleCustomSubmit}
            disabled={!customUniversity || !customCountry}
          >
            Add University
          </button>
        </div>
      )}
    </div>
  );
} 