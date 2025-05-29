const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const babyProfileRoutes = require('./routes/babyProfile');
const sleepingRoutes = require('./routes/sleeping');
const feedingRoutes = require('./routes/feeding');
const diaperRoutes = require('./routes/diaper');
const medicineRoutes = require('./routes/medicine');
const getLatestData = require('./routes/getLatestData');

app.use(express.json()); // To parse JSON body
app.use('/api/babyprofile', babyProfileRoutes);
app.use('/api/sleeping', sleepingRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/diaper', diaperRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api', getLatestData);

app.use(cors({
    origin: '*', // <-- allow requests from any origin (development only)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
