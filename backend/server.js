const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const authRoutes = require('./src/routes/auth');
const tripRoutes = require('./src/routes/trips');
const userRoutes = require('./src/routes/users');
const chatRoutes = require('./src/routes/chat');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const seedDemoUser = async () => {
  try {
    const email = 'demo@strangertour.com';
    const existing = await User.findOne({ email });
    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = new User({
      name: 'Demo Traveler',
      email,
      password: hashedPassword,
      profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      bio: 'Demo user for StrangerTour preview.',
      interests: ['adventure', 'culture', 'party'],
      budget: 'medium',
      verified: true
    });
    await user.save();
    console.log('Demo user seeded:', email);
  } catch (error) {
    console.error('Could not seed demo user:', error.message);
  }
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
  socket.on('join-trip', (tripId) => {
    socket.join(tripId);
  });

  socket.on('send-message', (message) => {
    if (message && message.tripId) {
      io.to(message.tripId).emit('receive-message', message);
    }
  });

  socket.on('disconnect', () => {
    // cleanup if needed
  });
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await seedDemoUser();
  server.listen(PORT, () => {
    console.log(`StrangerTour backend running on port ${PORT}`);
  });
})();
