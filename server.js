const express = require('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path');

// For testing purposes

// connect to mongoDB
connectDB();

// Init middleware

// This is for body parsing, to use body req you need this. This allows you to accept body data.
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

// Serve static assests in production (serve react)
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
