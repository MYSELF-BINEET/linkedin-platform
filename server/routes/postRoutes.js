const express = require('express');
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(postController.getAllPosts)
  .post(validatePost, postController.createPost);

router.route('/:id')
  .get(postController.getPost)
  .put(validatePost, postController.updatePost)
  .delete(postController.deletePost);

router.post('/:id/like', postController.likePost);
router.post('/:id/comments', postController.addComment);

module.exports = router;