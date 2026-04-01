const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth');

dotenv.config();
const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUserResponse = (user) => {
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

router.post('/register', async (req, res) => {
  const { name, email, password, profilePic, bio, interests, budget } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      profilePic,
      bio,
      interests,
      budget
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: createUserResponse(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/google', async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) return res.status(400).json({ error: 'Missing Google token' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;
    if (!email) return res.status(400).json({ error: 'Google token did not include an email' });

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      const hashed = await bcrypt.hash(`${sub}-${Date.now()}`, 10);
      user = new User({
        googleId: sub,
        name,
        email,
        password: hashed,
        profilePic: picture,
        verified: true,
        interests: [],
        budget: 'medium'
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    const payloadJwt = { user: { id: user.id } };
    const token = jwt.sign(payloadJwt, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: createUserResponse(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

router.post('/guest', async (req, res) => {
  try {
    const email = 'demo@strangertour.com';
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash('Password123!', 10);
      user = new User({
        name: 'Demo Traveler',
        email,
        password: hashed,
        profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        bio: 'Demo user for StrangerTour preview.',
        interests: ['adventure', 'culture', 'party'],
        budget: 'medium',
        verified: true
      });
      await user.save();
    }

    const payloadJwt = { user: { id: user.id } };
    const token = jwt.sign(payloadJwt, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: createUserResponse(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Guest login failed' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

module.exports = router;
