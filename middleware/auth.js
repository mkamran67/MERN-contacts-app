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
    let decoded = null;
    // verifying token
    if (process.env.NODE_ENV === 'production') {
      decoded = jwt.verify(token, process.env.jwtSecret);
    } else {
      decoded = jwt.verify(token, config.get('jwtSecret'));
    }

    req.user = decoded.user;
    // moving on (middleware function)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
