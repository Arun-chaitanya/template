import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  country: string;
  isCustom?: boolean;
}

const UniversitySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema); 