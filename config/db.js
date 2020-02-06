const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // grabs the global variable mongoURI

// for conencting to mongoDB (database)
const connectDB = async () => {
  try {
    // if in production do this else
    if (process.env.NODE_ENV === 'production') {
      console.log(`Starting in production mode...`);

      await mongoose.connect(process.env.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      });
    } else {
      console.log(`Development mode...`);
      console.log(process.env.NODE_ENV);

      await mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      });
    }

    console.log(`MongoDB Connected...`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
