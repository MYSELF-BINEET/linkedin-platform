const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// // Send token response
// const createSendToken = (user, statusCode, res, message = 'Success') => {
//   const token = generateToken(user._id);
// const isProd = process.env.NODE_ENV === 'production';
  
//   const cookieOptions = {
//         httpOnly: true,httpOnly: true,
//         secure: isProd, 
//         sameSite: isProd ? 'none' : 'lax',
//         maxAge: 7 * 24 * 60 * 60 * 1000
//   };

//   res.cookie('jwt', token, cookieOptions);

//   res.status(statusCode).json({
//     status: 'success',
//     message,
//     token,
//     data: {
//       user: user.getPublicProfile()
//     }
//   });
// };

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd, 
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: { user: user.getPublicProfile() }
  });
};


// Register new user
exports.register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, bio } = req.body;
    // console.log('Registering user:', { name, email, password, bio });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      bio: bio || ''
    });

    createSendToken(user, 201, res, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    createSendToken(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    next(error);
  }
};