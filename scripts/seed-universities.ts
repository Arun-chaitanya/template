import mongoose from 'mongoose';
import University from '../src/models/University';import connectDB from '@/lib/db';

// Sample list of universities
const universities = [
  { name: 'Harvard University', country: 'USA' },
  { name: 'Stanford University', country: 'USA' },
  { name: 'Massachusetts Institute of Technology', country: 'USA' },
  { name: 'University of Oxford', country: 'UK' },
  { name: 'University of Cambridge', country: 'UK' },
  { name: 'ETH Zurich', country: 'Switzerland' },
  { name: 'University of Toronto', country: 'Canada' },
  { name: 'National University of Singapore', country: 'Singapore' },
  // Add more universities as needed
];

async function seedUniversities() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing universities that are not custom
    await University.deleteMany({ isCustom: { $ne: true } });
    console.log('Cleared existing universities');

    // Insert new universities
    const result = await University.insertMany(
      universities.map(uni => ({ ...uni, isCustom: false }))
    );
    console.log(`Added ${result.length} universities`);

    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding universities:', error);
    process.exit(1);
  }
}

seedUniversities(); 