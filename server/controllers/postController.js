const Post = require('../models/post');
const { validationResult } = require('express-validator');

// Get all posts (home feed)
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate('author', 'name email bio profilePicture')
      .populate('comments.user', 'name profilePicture')
      .populate('likes.user', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ isActive: true });

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

// Create new post
exports.createPost = async (req, res, next) => {
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

    const { content } = req.body;

    const post = await Post.create({
      content,
      author: req.user.id
    });

    // Populate author info
    await post.populate('author', 'name email bio profilePicture');

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate('author', 'name email bio profilePicture')
      .populate('comments.user', 'name profilePicture')
      .populate('likes.user', 'name');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await Post.findOne({ 
      _id: req.params.id, 
      author: req.user.id,
      isActive: true 
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or unauthorized'
      });
    }

    post.content = content;
    await post.save();
    await post.populate('author', 'name email bio profilePicture');

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      author: req.user.id,
      isActive: true 
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or unauthorized'
      });
    }

    post.isActive = false; // Soft delete
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike post
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push({ user: req.user.id });
    }

    await post.save();
    await post.populate('author', 'name email bio profilePicture');
    await post.populate('likes.user', 'name');

    res.status(200).json({
      status: 'success',
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to post
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment content is required'
      });
    }

    const post = await Post.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user.id,
      content: content.trim()
    });

    await post.save();
    await post.populate('author', 'name email bio profilePicture');
    await post.populate('comments.user', 'name profilePicture');

    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};