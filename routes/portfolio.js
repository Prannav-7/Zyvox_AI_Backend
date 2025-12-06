import express from 'express';
import { PortfolioModel } from '../models/User.js';

const router = express.Router();

// Save portfolio
router.post('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const portfolioData = req.body;

    const result = await PortfolioModel.savePortfolio(clerkId, portfolioData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Portfolio saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio
router.get('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const portfolio = await PortfolioModel.getPortfolio(clerkId);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add investment
router.post('/:clerkId/investment', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const investmentData = req.body;

    const result = await PortfolioModel.addInvestment(clerkId, {
      ...investmentData,
      createdAt: new Date()
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Investment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get investments
router.get('/:clerkId/investments', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const investments = await PortfolioModel.getInvestments(clerkId);

    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
