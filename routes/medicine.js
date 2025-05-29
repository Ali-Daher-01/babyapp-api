const express = require('express');
const router = express.Router();
const db = require('../db');

// Add medicine schedule
router.post('/add', (req, res) => {
  const { babyId, name, frequency, endDate } = req.body;

  if (!babyId || !name || !frequency || !endDate) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const query = `
    INSERT INTO Medicine (BabyID, MedicineName, Frequency, EndDate)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [babyId, name, frequency, endDate], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert medicine data:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(201).json({ message: 'Medicine entry added successfully.' });
  });
});

module.exports = router;
