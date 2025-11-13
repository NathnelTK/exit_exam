const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    'your-secret-key',
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken };

