import mongoose from 'mongoose';

type CachedType = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedType | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const cached: CachedType = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('🟢 Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      console.log('⏳ Creating new MongoDB connection...');
      mongoose.set('strictQuery', false);
      
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      });
    }

    cached.conn = await cached.promise;
    console.log('✅ Successfully connected to MongoDB');
    console.log('📊 Connection Details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    cached.promise = null;
    throw error;
  }
}

// Ensure connection is established before server starts
connectDB().catch(error => {
  console.error('❌ Initial MongoDB connection failed:', error);
});

export default connectDB;
