const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // grabs the global variable mongoURI

// for conencting to mongoDB (database)
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected...`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
