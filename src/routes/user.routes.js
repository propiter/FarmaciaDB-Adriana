const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

// Public routes
router.post('/register', userController.register);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);

module.exports = router;
