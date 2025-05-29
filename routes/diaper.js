const express = require('express');
const router = express.Router();
const db = require('../db');

// Add diaper change record
router.post('/add', (req, res) => {
  const { babyId, timeStamp, diaperType } = req.body;

  if (!babyId || !timeStamp || !diaperType) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const query = `
    INSERT INTO DiaperChanging (BabyID, TimeStamp, DiaperType)
    VALUES (?, ?, ?)
  `;

  db.query(query, [babyId, timeStamp, diaperType], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert diaper changing record:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(201).json({ message: 'Diaper change recorded successfully.' });
  });
});

module.exports = router;
