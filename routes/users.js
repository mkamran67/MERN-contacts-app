const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST    api/users
// @desc    Register a user, validate login credentials, submit/save to DB, return token
// @access  Public
// Parameters -> ( route, For express-validator, promise)
router.post(
  '/',
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if errors is not empty return 400 (bad signal) and send back the array which will contain the errors provided by "check" - express-validator
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // deconstructing the name , email, and password from body
    const { name, email, password } = req.body;

    try {
      // findOne is a mongoose function to search data with the specific field (any within their schema) in this is the unique email
      // Checking if user email already exists
      let user = await User.findOne({ email });

      // if user email already exists
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // since user didn't exist we add it to a new User obj (schema)
      user = new User({
        name,
        email,
        password
      });

      // for encyrption of password, returns promise, salt is the level of encyrption 10 is default
      const salt = await bcrypt.genSalt(10);

      // setting the password and encrypting with bcrypt we provide the string password and salt the multiplier
      user.password = await bcrypt.hash(password, salt); // hashed version of the password

      // We save the user to database
      await user.save();

      // will contain an obj user with id within it
      const payload = {
        user: {
          id: user.id
        }
      };

      // payload is the user.id that'll be attached to this token for this is the current user
      // jwtSecret is a string used for authentication when decrypting jwt tokens
      // expiresIn, simply expires at the end of that time.
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
      console.error(error.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
