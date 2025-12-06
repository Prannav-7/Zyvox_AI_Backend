import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    cachedClient = client;
    cachedDb = client.db('zyvox_ai');
    
    console.log('✅ MongoDB Connected Successfully');
    return { client, db: cachedDb };
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!cachedDb) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return cachedDb;
}

export async function closeDB() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('📴 MongoDB Connection Closed');
  }
}
