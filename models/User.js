import { getDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';

export class UserModel {
  static async create(userData) {
    const db = getDatabase();
    const user = {
      clerkId: userData.clerkId,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      profileImage: userData.profileImage || '',
      portfolio: {},
      investments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findByClerkId(clerkId) {
    const db = getDatabase();
    return await db.collection('users').findOne({ clerkId });
  }

  static async findById(id) {
    const db = getDatabase();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  static async findAll() {
    const db = getDatabase();
    return await db.collection('users').find({}).toArray();
  }

  static async updateByClerkId(clerkId, updateData) {
    const db = getDatabase();
    const result = await db.collection('users').updateOne(
      { clerkId },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result;
  }

  static async updateById(id, updateData) {
    const db = getDatabase();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result;
  }

  static async deleteByClerkId(clerkId) {
    const db = getDatabase();
    return await db.collection('users').deleteOne({ clerkId });
  }

  static async deleteById(id) {
    const db = getDatabase();
    return await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  }

  static async upsertByClerkId(clerkId, userData) {
    const db = getDatabase();
    const result = await db.collection('users').updateOne(
      { clerkId },
      { $set: { ...userData, updatedAt: new Date() } },
      { upsert: true }
    );
    return result;
  }
}

export class PortfolioModel {
  static async savePortfolio(clerkId, portfolioData) {
    const db = getDatabase();
    const result = await db.collection('users').updateOne(
      { clerkId },
      { $set: { portfolio: portfolioData, updatedAt: new Date() } }
    );
    return result;
  }

  static async getPortfolio(clerkId) {
    const db = getDatabase();
    const user = await db.collection('users').findOne(
      { clerkId },
      { projection: { portfolio: 1 } }
    );
    return user?.portfolio || null;
  }

  static async addInvestment(clerkId, investmentData) {
    const db = getDatabase();
    const result = await db.collection('users').updateOne(
      { clerkId },
      { 
        $push: { investments: investmentData },
        $set: { updatedAt: new Date() }
      }
    );
    return result;
  }

  static async getInvestments(clerkId) {
    const db = getDatabase();
    const user = await db.collection('users').findOne(
      { clerkId },
      { projection: { investments: 1 } }
    );
    return user?.investments || [];
  }
}
