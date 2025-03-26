import mongoose from 'mongoose';

const questionnaireResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    type: {
      type: String,
      enum: ['SOP', 'LOR'],
      required: true,
    },
    responses: [{
      questionId: String,
      question: String,
      answer: String,
      category: String,
    }],
    status: {
      type: String,
      enum: ['incomplete', 'completed'],
      default: 'incomplete',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.QuestionnaireResponse || 
  mongoose.model('QuestionnaireResponse', questionnaireResponseSchema); 