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

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/subscription-plans', require('./routes/subscriptionPlanRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Default API route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error handler middleware - must be before the catch-all route
app.use(errorHandler);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static assets with proper MIME types
  app.use(express.static(path.join(__dirname, '../client/build'), {
    setHeaders: (res, path) => {
      // Set correct content type for JavaScript files
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      // Set correct content type for CSS files
      else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  
  // All other GET requests not handled before will return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Default route - only used when not in production
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
  });
}

const PORT =process.env.PORT || 5003;

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
  app.listen(availablePort, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${availablePort}`.yellow.bold);
    if (availablePort !== PORT) {
      console.log(`Note: Default port ${PORT} was already in use, using port ${availablePort} instead`.yellow);
    }
  });
});
