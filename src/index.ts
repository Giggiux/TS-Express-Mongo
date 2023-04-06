// src/index.ts

import express from 'express';
import mongoose from 'mongoose';
import router from './api/routes';

const app = express();
app.use(express.json());

const MONGODB_URI = 'your_mongodb_uri';

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Your routes will go here

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.use('/api', router);
