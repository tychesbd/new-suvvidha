const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)){
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5003;

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    // Ensure port is a number
    const port = parseInt(startPort, 10);
    
    // Create a server to test the port
    const server = require('net').createServer();
    
    server.once('error', () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(port + 1));
    });
    
    server.once('listening', () => {
      // Port is available, close the server and return the port
      server.close(() => {
        resolve(port);
      });
    });
    
    server.listen(port);
  });
};

// Start server with port detection
findAvailablePort(PORT).then((availablePort) => {
  app.listen(availablePort, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${availablePort}`.yellow.bold);
    if (availablePort !== PORT) {
      console.log(`Note: Default port ${PORT} was already in use, using port ${availablePort} instead`.yellow);
    }
  });
});