const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/suggested', auth, async (req, res) => {
  try {
    const current = await User.findById(req.user.id);
    const users = await User.find({
      _id: { $ne: req.user.id },
      budget: current.budget,
      interests: { $in: current.interests }
    })
      .limit(8)
      .select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load suggested travelers' });
  }
});

router.put('/update', auth, async (req, res) => {
  const { name, profilePic, bio, interests, budget } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profilePic, bio, interests, budget },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

module.exports = router;
