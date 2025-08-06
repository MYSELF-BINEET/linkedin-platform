const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { cookie } = require('express-validator');

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;

    // console.log('Request Headers:', req.headers);
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.cookie) {
      const cookieHeader = req.headers.cookie; // all cookies
      const jwtCookie = cookieHeader?.split('; ').find(c => c.startsWith('jwt='));
      token = jwtCookie?.replace(/^jwt=/, '');
    }

    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    console.log('Current User:', currentUser);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again!'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong during authentication'
    });
  }
};