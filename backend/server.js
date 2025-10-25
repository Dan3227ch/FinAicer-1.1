require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');
const notificationRoutes = require('./routes/notifications.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'API FinAicer operativa' });
});

// Auth Routes
app.use('/api/auth', authRoutes);
// AI Routes (Protected)
app.use('/api/ai', authMiddleware, aiRoutes);
// Notification Routes (Protected)
app.use('/api/notifications', authMiddleware, notificationRoutes);


// Sample Protected Route
app.get('/api/transactions', authMiddleware, (req, res) => {
    // Thanks to authMiddleware, we have req.user
    res.json({
        message: `Welcome user ${req.user.id}. Here are your transactions.`,
        transactions: [] // Placeholder for actual transaction data
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});