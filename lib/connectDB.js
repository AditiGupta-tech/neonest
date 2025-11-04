import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'neonest',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).catch((error) => {
      cached.promise = null;
      throw new Error(`Database connection failed: ${error.message}`);
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
