const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://tychesbd:918TUn5Sm98q4B64@suvvidhaadminvendorfeat.xe7rxuc.mongodb.net/retryWrites=true&w=majority");
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;