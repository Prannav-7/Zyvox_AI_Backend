import express from 'express';
import { UserModel, PortfolioModel } from '../models/User.js';

const router = express.Router();

// Create or update user (from Clerk webhook)
router.post('/', async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, profileImage } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ error: 'clerkId and email are required' });
    }

    const existingUser = await UserModel.findByClerkId(clerkId);
    if (existingUser) {
      await UserModel.updateByClerkId(clerkId, {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        profileImage: profileImage || existingUser.profileImage
      });
      return res.json({ message: 'User updated successfully' });
    }

    const newUser = await UserModel.create({
      clerkId,
      email,
      firstName,
      lastName,
      profileImage
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by Clerk ID
router.get('/clerk/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await UserModel.findByClerkId(clerkId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only - implement auth in production)
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const updateData = req.body;

    const result = await UserModel.updateByClerkId(clerkId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const result = await UserModel.deleteByClerkId(clerkId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
