export interface SOPQuestion {
  id: string;
  title: string;
  description: string;
  category: SOPCategory;
  required: boolean;
  maxLength?: number;
}

export type SOPCategory = 
  | 'academic_background'
  | 'professional_experience'
  | 'career_goals'
  | 'personal_development'
  | 'specialization';

export interface SOPAnswer {
  questionId: string;
  answer: string;
  lastUpdated: Date;
}

export interface MasterSOP {
  id: string;
  userId: string;
  answers: SOPAnswer[];
  status: 'draft' | 'completed';
  lastUpdated: Date;
} 