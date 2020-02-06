const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

// @route   GET    api/auth
// @desc    Get logged in user
// @access  Private

// auth is passed in as a 2nd parameter, thus a protected route.
router.get('/', auth, async (req, res) => {
  try {
    // get user By ID minus the password
    // since auth is the 2nd param and we're sending a valid token req obj will contain the user.id

    const user = await User.findById(req.user.id).select('-password');

    // return user
    res.json(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

// @route   POST    api/user
// @desc    Authorize user and return a token (login)
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if errors is not empty return 400 (bad signal) and send back the array which will contain the errors provided by "check" - express-validator
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // grab email and password from body (JSON data)
    const { email, password } = req.body;

    try {
      // find the user by email
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid email' });
      }

      // check if password matches with bcrypt for decrypting input taken is (string, and hash password)
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log(`Match failed`);

        return res.status(400).json({ msg: 'Invalid passowrd' });
      }

      // if everything goes correctly assign payload to the User ID
      const payload = {
        user: {
          id: user.id
        }
      };

      // payload is the user that'll be attached to this token
      // jwtSecret is a global string, variable for decrypting and encrypting (hashing)
      // expiresIn, simply expires at the end of that time.
      // To sign, add time , and return the token
      jwt.sign(
        payload,
        process.env.NODE_ENV === 'production'
          ? process.env.jwtSecret
          : config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // return token
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
