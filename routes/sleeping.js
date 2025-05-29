const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a new sleeping record
router.post('/add', (req, res) => {
  const { babyId, timeStamp, timeSpent } = req.body;

  if (!babyId || !timeStamp || !timeSpent) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const query = `
    INSERT INTO Sleeping (BabyID, TimeStamp, TimeSpent)
    VALUES (?, ?, ?)
  `;

  db.query(query, [babyId, timeStamp, timeSpent], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert sleeping data:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(201).json({ message: 'Sleeping data added successfully.' });
  });
});

module.exports = router;
