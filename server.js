const express = require('express');
const connectDB = require('./config/db');
const app = express();

// connect to mongoDB
connectDB();

// Init middleware

// This is for body parsing, to use body req you need this. This allows you to accept body data.
app.use(express.json({ extended: false }));

// router
app.get('/', (req, res) => res.send(`Hello world`));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
