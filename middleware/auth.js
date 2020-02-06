const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header 'x-auth-token' is the "key" for the token
  const token = req.header('x-auth-token');

  // check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // verifying token
    if (process.env.NODE_ENV === 'production') {
      const decoded = jwt.verify(token, process.env.jwtSecret);
    } else {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
    }

    // getting the user from the payload
    req.user = decoded.user;

    // moving on (middleware function)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
