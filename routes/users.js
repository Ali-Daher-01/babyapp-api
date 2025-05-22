const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');

// Register a new user
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds is standard

    const query = 'INSERT INTO UserAccount (Email, Username, Password) VALUES (?, ?, ?)';
    db.query(query, [email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error during registration.' });
      }

      res.status(201).json({
        message: 'User registered successfully.',
        userId: result.insertId,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Log in
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM UserAccount WHERE Email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error during login.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ message: 'Login successful.', userId: user.UserID });
  });
});


module.exports = router;