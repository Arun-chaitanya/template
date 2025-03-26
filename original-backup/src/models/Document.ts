import mongoose, { Schema } from 'mongoose';

export type DocumentType = 
  | 'sop-master' 
  | 'sop-university' 
  | 'essay' 
  | 'lor-professor' 
  | 'lor-manager'
  | 'lor-company'
  | 'lor-internship'
  | undefined;

export interface IDocument {
  _id: string;
  userId: string;
  type: DocumentType;
  title: string;
  university?: string;
  recommender?: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
  metadata?: {
    university?: {
      name: string;
      program: string;
      deadline: Date;
    };
    recommender?: {
      name: string;
      title: string;
      institution: string;
      email: string;
    };
  };
  status: 'draft' | 'completed' | 'archived';
  lastUpdated: Date;
  universityId?: mongoose.Types.ObjectId;
  program?: string;
  generatedContent?: string;
  createdAt: Date;
}

const documentSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'sop-university', 
      'sop-master', 
      'essay-university', 
      'lor-professor', 
      'lor-company', 
      'lor-internship'
    ],
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  university: String,
  recommender: String,
  answers: [{
    questionId: String,
    answer: String,
  }],
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
  },
  program: {
    type: String,
  },
  generatedContent: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
});

// Create indexes for better query performance
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ userId: 1, university: 1 });
documentSchema.index({ userId: 1, recommender: 1 });
documentSchema.index({ lastUpdated: -1 });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema); 