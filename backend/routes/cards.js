import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

// Get all cards
router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// Add card
router.post('/', async (req, res) => {
  const newCard = new Card(req.body);
  await newCard.save();
  res.json({ success: true });
});

// Delete card
router.delete('/:id', async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
