const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

router.get('/:tripId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ tripId: req.params.tripId })
      .sort('timestamp')
      .populate('senderId', 'name profilePic');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load messages' });
  }
});

router.post('/:tripId', auth, async (req, res) => {
  try {
    const message = new Message({
      tripId: req.params.tripId,
      senderId: req.user.id,
      text: req.body.text
    });
    await message.save();
    const populated = await message.populate('senderId', 'name profilePic');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not send message' });
  }
});

module.exports = router;
