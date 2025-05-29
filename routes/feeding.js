const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', (req, res) => {
  const { babyId, feedingType, qty, timeSpent } = req.body;

  if (!babyId || !feedingType) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const query = `
    INSERT INTO Feeding (BabyID, FeedingType, TimeStamp, Qty, TimeSpent)
    VALUES (?, ?, NOW(), ?, ?)
  `;

  db.query(query, [babyId, feedingType, qty || null, timeSpent || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Feeding entry added successfully' });
  });
});

module.exports = router;
