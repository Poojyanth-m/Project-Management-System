import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { asyncHandler } from '../../../middlewares/asyncHandler';
import { authenticate } from '../../../middlewares/auth';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', asyncHandler(authController.register.bind(authController)));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', asyncHandler(authController.login.bind(authController)));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', asyncHandler(authController.refresh.bind(authController)));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset
 * @access  Public
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword.bind(authController)));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Protected
 */
router.post('/logout', authenticate, asyncHandler(authController.logout.bind(authController)));

export default router;
