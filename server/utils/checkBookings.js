const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the database connection from config
const connectDB = require('../config/db');

const checkBookings = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Define a simple schema for Booking to query the collection
    const bookingSchema = new mongoose.Schema({}, { strict: false });
    const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
    
    // Find all bookings
    const bookings = await Booking.find({});
    
    console.log('Total bookings found:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('First booking sample:');
      console.log(JSON.stringify(bookings[0], null, 2));
    } else {
      console.log('No bookings found in database');
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
};

// Run the function
checkBookings();