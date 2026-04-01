const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('creatorId', 'name profilePic interests budget verified')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load trips' });
  }
});

router.get('/recommended', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recommended = await Trip.find({
      budget: user.budget,
      destination: { $regex: user.interests.join('|'), $options: 'i' }
    })
      .limit(6)
      .populate('creatorId', 'name profilePic');
    res.json(recommended);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load recommendations' });
  }
});

router.post('/', auth, async (req, res) => {
  const { destination, startDate, endDate, budget, description, maxGroupSize, image } = req.body;

  try {
    const trip = new Trip({
      creatorId: req.user.id,
      destination,
      startDate,
      endDate,
      budget,
      description,
      maxGroupSize,
      image,
      members: [req.user.id]
    });
    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create trip' });
  }
});

router.post('/:id/request', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (trip.members.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already joined' });
    }

    if (trip.requests.some((r) => r.userId.toString() === req.user.id)) {
      return res.status(400).json({ error: 'Request already sent' });
    }

    trip.requests.push({ userId: req.user.id });
    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not submit join request' });
  }
});

router.put('/:tripId/requests/:requestId/:action', auth, async (req, res) => {
  const { tripId, requestId, action } = req.params;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const request = trip.requests.id(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    if (request.status === 'accepted') {
      trip.members.push(request.userId);
    }

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update request' });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const owned = await Trip.find({ creatorId: req.user.id }).populate('creatorId', 'name');
    const joined = await Trip.find({ members: req.user.id }).populate('creatorId', 'name');
    res.json({ owned, joined });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load dashboard trips' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('creatorId', 'name email profilePic')
      .populate('members', 'name profilePic')
      .populate('requests.userId', 'name profilePic interests');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load trip details' });
  }
});

module.exports = router;
