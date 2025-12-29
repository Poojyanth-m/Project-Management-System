import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private (must be project member)
 */
router.post('/', asyncHandler(tasksController.createTask.bind(tasksController)));

/**
 * @route   GET /api/tasks
 * @desc    Get tasks with optional filters (projectId, status, priority, assigneeId)
 * @access  Private
 */
router.get('/', asyncHandler(tasksController.getTasks.bind(tasksController)));

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private (must be project member)
 */
router.get('/:id', asyncHandler(tasksController.getTaskById.bind(tasksController)));

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Update task
 * @access  Private (must be project member)
 */
router.patch('/:id', asyncHandler(tasksController.updateTask.bind(tasksController)));

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Soft delete task
 * @access  Private (must be project member)
 */
router.delete('/:id', asyncHandler(tasksController.deleteTask.bind(tasksController)));

export default router;
