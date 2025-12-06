import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

// Handle Clerk user events
router.post('/user', async (req, res) => {
  try {
    const event = req.body;
    const { type, data } = event;

    console.log(`📩 Webhook Event: ${type}`);

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log(`⚠️ Unknown event type: ${type}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create user in MongoDB when Clerk user is created
async function handleUserCreated(data) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data;

    const userData = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || '',
      firstName: first_name || '',
      lastName: last_name || '',
      profileImage: image_url || ''
    };

    const existingUser = await UserModel.findByClerkId(id);
    if (!existingUser) {
      await UserModel.create(userData);
      console.log(`✅ User created in MongoDB: ${userData.email}`);
    }
  } catch (error) {
    console.error('❌ Error handling user.created:', error);
    throw error;
  }
}

// Update user in MongoDB when Clerk user is updated
async function handleUserUpdated(data) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data;

    const updateData = {
      firstName: first_name || '',
      lastName: last_name || '',
      email: email_addresses?.[0]?.email_address || '',
      profileImage: image_url || ''
    };

    await UserModel.updateByClerkId(id, updateData);
    console.log(`✅ User updated in MongoDB: ${id}`);
  } catch (error) {
    console.error('❌ Error handling user.updated:', error);
    throw error;
  }
}

// Delete user from MongoDB when Clerk user is deleted
async function handleUserDeleted(data) {
  try {
    const { id } = data;

    await UserModel.deleteByClerkId(id);
    console.log(`✅ User deleted from MongoDB: ${id}`);
  } catch (error) {
    console.error('❌ Error handling user.deleted:', error);
    throw error;
  }
}

export default router;
