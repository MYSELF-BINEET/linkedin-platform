const User = require('../models/user');
const Post = require('../models/post');

// Get all users (for discovery)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's posts
exports.getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      author: req.params.id, 
      isActive: true 
    })
      .populate('author', 'name email bio profilePicture')
      .populate('comments.user', 'name profilePicture')
      .populate('likes.user', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ 
      author: req.params.id, 
      isActive: true 
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, website } = req.body;
    
    // Fields that can be updated
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const { cloudinary } = require('../config/cloudinary');

// Upload profile picture
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Get the current user to delete old profile picture if exists
    const user = await User.findById(req.user.id);
    
    // Delete old profile picture from Cloudinary if exists
    if (user.profilePicture) {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = user.profilePicture
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error('Error deleting old profile picture:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Update user with new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully',
      data: {
        user: updatedUser,
        imageUrl: req.file.path
      }
    });
  } catch (error) {
    // If there's an error and file was uploaded, try to delete it
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (deleteError) {
        console.error('Error deleting uploaded file after error:', deleteError);
      }
    }
    next(error);
  }
};

// Delete profile picture
exports.deleteProfilePicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.profilePicture) {
      return res.status(400).json({
        status: 'error',
        message: 'No profile picture to delete'
      });
    }

    // Extract public_id from Cloudinary URL and delete from Cloudinary
    try {
      const publicId = user.profilePicture
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
      
      await cloudinary.uploader.destroy(publicId);
    } catch (deleteError) {
      console.error('Error deleting from Cloudinary:', deleteError);
    }

    // Remove profile picture URL from user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: '' },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Profile picture deleted successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.uploadCoverPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Get the current user to delete old profile picture if exists
    const user = await User.findById(req.user.id);
    
    // Delete old profile picture from Cloudinary if exists
    if (user.coverPhoto) {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = user.coverPhoto
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error('Error deleting old profile picture:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Update user with new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { coverPhoto: req.file.path },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('Updated User:', updatedUser);

    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully',
      data: {
        user: updatedUser,
        imageUrl: req.file.path
      }
    });
  } catch (error) {
    // If there's an error and file was uploaded, try to delete it
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (deleteError) {
        console.error('Error deleting uploaded file after error:', deleteError);
      }
    }
    next(error);
  }
};

exports.deleteCoverPhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.coverPhoto) {
      return res.status(400).json({
        status: 'error',
        message: 'No profile picture to delete'
      });
    }

    // Extract public_id from Cloudinary URL and delete from Cloudinary
    try {
      const publicId = user.coverPhoto
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
      
      await cloudinary.uploader.destroy(publicId);
    } catch (deleteError) {
      console.error('Error deleting from Cloudinary:', deleteError);
    }

    // Remove profile picture URL from user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { coverPhoto: '' },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Profile picture deleted successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};