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
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO UserAccount (Email, Username, Password) VALUES (?, ?, ?)';
    await db.execute(query, [email, username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during registration.' });
  }
});
 

// Log in
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM UserAccount WHERE Email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err)
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


//changepass 

router.put('/change-password', (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'User ID and new password are required.' });
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('❌ Error hashing password:', err);
      return res.status(500).json({ message: 'Error hashing password' });
    }

    db.query(
      'UPDATE UserAccount SET Password = ? WHERE UserID = ?',
      [hashedPassword, userId],
      (error, results) => {
        if (error) {
          console.error('❌ Error updating password:', error);
          return res.status(500).json({ message: 'Error updating password in database' });
        }

        res.json({ message: '✅ Password updated successfully.' });
      }
    );
  });
});

module.exports = router;
