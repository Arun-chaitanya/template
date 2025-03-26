import mongoose from 'mongoose';

const recommenderSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: String,
    institution: String,
    relationship: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'declined'],
      default: 'pending',
    },
    accessToken: String,
    expiryDate: Date,
    submittedDate: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Recommender || mongoose.model('Recommender', recommenderSchema); 