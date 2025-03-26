import { NextRequest, NextResponse } from 'next/server';
import University from '@/models/University';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get universities sorted by name
    const universities = await University.find()
      .sort({ name: 1 })
      .select('name country _id')
      .lean();
    
    return NextResponse.json(universities, { status: 200 });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { name, country } = body;
    
    if (!name || !country) {
      return NextResponse.json(
        { error: 'Name and country are required' },
        { status: 400 }
      );
    }
    
    // Check if university already exists
    const existingUniversity = await University.findOne({ name });
    if (existingUniversity) {
      return NextResponse.json(
        { error: 'University already exists', university: existingUniversity },
        { status: 409 }
      );
    }
    
    // Create new university with isCustom flag
    const university = await University.create({
      name,
      country,
      isCustom: true,
    });
    
    return NextResponse.json({ university }, { status: 201 });
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
} 