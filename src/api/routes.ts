import express from 'express';
import { Counter } from '../models/Counter';
import { addChannel, removeChannel } from '../twitch';
import { authMiddleware, generateToken } from '../middleware/auth';
import { User } from '../models/User';
import pusher from '../pusher';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send('Invalid email or password');
  }

  const token = generateToken(user._id);
  res.status(200).json({ token });
});

// Add user (accessible by authenticated users only)
router.post('/users', authMiddleware, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Add username to Twitch chat
router.post('/usernames', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    await addChannel(username);
    res.status(200).send('Connected to Twitch chat');
  } catch (err) {
    res.status(500).send('Failed to connect to Twitch chat');
  }
});

// Remove username from Twitch chat
router.delete('/usernames', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    await removeChannel(username);
    res.status(200).send('Disconnected from Twitch chat');
  } catch (err) {
    res.status(500).send('Failed to disconnect from Twitch chat');
  }
});

// Increase piglins number
router.post('/piglins', async (req, res) => {
  const { value } = req.body;

  if (
    value === undefined ||
    typeof value !== 'number' ||
    !Number.isInteger(value)
  ) {
    return res
      .status(400)
      .send(
        'Invalid value. Please provide an integer value to update piglins.'
      );
  }

  const counter = await Counter.findOneAndUpdate(
    {},
    { $inc: { piglins: value } },
    { new: true, upsert: true }
  );

  if (counter) {
    pusher.trigger('counter', 'update', { piglins: counter.piglins });
    res.status(200).send('Piglins number increased');
  } else {
    res.status(500).send('Failed to update piglins number');
  }
});

export default router;
