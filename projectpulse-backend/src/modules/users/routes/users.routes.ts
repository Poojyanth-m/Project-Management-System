import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(usersController.getMe.bind(usersController)));

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/me', authenticate, asyncHandler(usersController.updateMe.bind(usersController)));

/**
 * @route   GET /api/users/me/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/me/settings', authenticate, asyncHandler(usersController.getMySettings.bind(usersController)));

/**
 * @route   PATCH /api/users/me/settings
 * @desc    Update user settings
 * @access  Private
 */
router.patch('/me/settings', authenticate, asyncHandler(usersController.updateMySettings.bind(usersController)));

/**
 * @route   POST /api/users/me/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/me/change-password', authenticate, asyncHandler(usersController.changePassword.bind(usersController)));

/**
 * @route   DELETE /api/users/me
 * @desc    Delete own account
 * @access  Private
 */
router.delete('/me', authenticate, asyncHandler(usersController.deleteMe.bind(usersController)));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(usersController.getUserById.bind(usersController)));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin/Manager ideally, but open for now)
 */
router.get('/', authenticate, asyncHandler(usersController.getUsers.bind(usersController)));

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.patch('/:id', authenticate, asyncHandler(usersController.updateUser.bind(usersController)));

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, asyncHandler(usersController.deleteUser.bind(usersController)));

export default router;
