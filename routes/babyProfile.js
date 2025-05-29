const express = require('express');
const router = express.Router();
const db = require('../db');

// GET baby profiles for a user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM BabyProfile WHERE UserID = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching baby profiles:', err);
      return res.status(500).json({ message: 'Server error while fetching baby profiles.' });
    }

    res.status(200).json(results);
  });
});

// POST a new baby profile
router.post('/add', (req, res) => {
  const { userId, name, birthday, gender, weight, height, chronicDisease } = req.body;

  if (!userId || !name || !birthday || !gender) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const query = `
    INSERT INTO BabyProfile (UserID, Name, Birthday, Gender, Weight, Height, ChronicDisease)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [userId, name, birthday, gender, weight || null, height || null, chronicDisease || null],
    (err, result) => {
      if (err) {
        console.error('❌ Error inserting baby profile:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({ message: 'Baby profile added successfully', profileId: result.insertId });
    }
  );
});

// Update a baby profile
router.put('/update/:babyId', (req, res) => {
  const { babyId } = req.params;
  const { name, birthday, gender, weight, height, chronicDisease } = req.body;

  const query = `
    UPDATE BabyProfile
    SET Name = ?, Birthday = ?, Gender = ?, Weight = ?, Height = ?, ChronicDisease = ?
    WHERE BabyID = ?
  `;
  db.query(query, [name, birthday, gender, weight || null, height || null, chronicDisease || null, babyId], (err) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Delete a baby profile
router.delete('/delete/:babyId', (req, res) => {
  const { babyId } = req.params;

  db.query('DELETE FROM BabyProfile WHERE BabyID = ?', [babyId], (err) => {
    if (err) {
      console.error('Error deleting profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  });
});

module.exports = router;
