// src/models/Counter.ts

import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  piglins: { type: Number, default: 0 },
});

export const Counter = mongoose.model('Counter', counterSchema);
