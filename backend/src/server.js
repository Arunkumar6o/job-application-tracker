const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const applicationRoutes = require('./routes/applicationRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow frontend dev server
  credentials: true,
}));
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Job Application Tracker API is running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// Applications API routes
app.use('/api/applications', applicationRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server only when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Job Application Tracker Backend`);
    console.log(`Server listening on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`===========================================`);
  });
}

module.exports = app;
