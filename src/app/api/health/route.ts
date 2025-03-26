import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const status = {
      connected: mongoose.connection.readyState === 1,
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 