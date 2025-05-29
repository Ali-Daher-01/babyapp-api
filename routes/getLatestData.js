const express = require('express');
const router = express.Router();
const con = require('../db');

// Get latest feeding entry
router.get('/feeding/latest/:babyId', (req, res) => {
  const babyId = req.params.babyId;
  const sql = "SELECT FeedingType, Qty, TimeStamp, TimeSpent FROM Feeding WHERE BabyID = ? ORDER BY TimeStamp DESC LIMIT 1";

  con.query(sql, [babyId], (err, result) => {
    if (err) {
      console.error('Error fetching latest feeding:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
  res.json(result[0]);
} else {
  res.json({ message: "No data found" });
}
  });
});

// Get latest sleeping entry
router.get('/sleeping/last/:babyId', (req, res) => {
  const babyId = req.params.babyId;
  const sql = "SELECT TimeStamp, TimeSpent FROM Sleeping WHERE BabyID = ? ORDER BY TimeStamp DESC LIMIT 1";

  con.query(sql, [babyId], (err, result) => {
    if (err) {
      console.error('Error fetching latest sleeping:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(result[0] || {});
  });
});

// Get latest diaper change entry
router.get('/diaper/latest/:babyId', (req, res) => {
  const babyId = req.params.babyId;
  const sql = "SELECT DiaperType, TimeStamp FROM DiaperChanging WHERE BabyID = ? ORDER BY TimeStamp DESC LIMIT 1";

  con.query(sql, [babyId], (err, result) => {
    if (err) {
      console.error('Error fetching latest diaper change:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(result[0] || {});
  });
});

// Get latest medicine entry
router.get('/medicine/latest/:babyId', (req, res) => {
  const babyId = req.params.babyId;
  const sql = `
  SELECT MedicineName, Frequency, EndDate 
  FROM Medicine 
  WHERE BabyID = ? AND EndDate >= CURDATE()
  ORDER BY EndDate ASC 
  LIMIT 1
`;

  con.query(sql, [babyId], (err, result) => {
    if (err) {
      console.error('Error fetching latest medicine:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(result[0] || {});
  });
});

module.exports = router;
