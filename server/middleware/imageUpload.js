const validateImageUpload = (req, res, next) => {
  // Additional validation can be added here
  if (req.file) {
    // Check file size (additional check)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        status: 'error',
        message: 'File size too large. Maximum size is 5MB'
      });
    }
  }
  next();
};