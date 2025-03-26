export type InputType = 'text' | 'date' | 'radio' | 'scale';
export type ViewMode = 'sidebar' | 'topnav';

export interface Question {
  id: string;
  title: string;
  type: InputType;
  required: boolean;
  category?: string;
  description?: string;
  maxLength?: number;
  options?: string[]; // For radio buttons
  scale?: {
    min: number;
    max: number;
    step: number;
  };
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface DocumentEditorProps {
  title: string;
  questions: Array<Question>;
  categories: Record<string, { title: string; description: string }>;
  initialAnswers?: Record<string, string>;
  documentId: string;
}
