'use client';

import { useState } from 'react';
import { University } from '@/lib/api/universities';
import UniversitySelect from '../common/UniversitySelect/UniversitySelect';

export default function SopForm() {
  const [formData, setFormData] = useState({
    universityId: '',
    // other form fields
  });

  const handleUniversityChange = (university: University) => {
    setFormData({
      ...formData,
      universityId: university._id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add University SOP/Essay</h2>
      
      <UniversitySelect
        value={formData.universityId}
        onChange={handleUniversityChange}
        required
        label="Select University"
      />
      
      {/* Other form fields */}
      
      <button type="submit">Submit</button>
    </form>
  );
} 