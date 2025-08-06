const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/posts', userController.getUserPosts);
router.put('/profile', userController.updateProfile);

router.post('/profile-picture', 
  upload.single('profilePicture'), 
  userController.uploadProfilePicture
);
router.delete('/profile-picture', userController.deleteProfilePicture);

router.post('/cover-photo', 
  upload.single('coverPhoto'), 
  userController.uploadCoverPhoto
);
router.delete('/cover-photo', userController.deleteCoverPhoto);

module.exports = router;
