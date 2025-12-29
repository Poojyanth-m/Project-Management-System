import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', asyncHandler(projectsController.createProject.bind(projectsController)));

/**
 * @route   GET /api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', asyncHandler(projectsController.getProjects.bind(projectsController)));

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private (must be project member)
 */
router.get('/:id', asyncHandler(projectsController.getProjectById.bind(projectsController)));

/**
 * @route   PATCH /api/projects/:id
 * @desc    Update project
 * @access  Private (owner or manager only)
 */
router.patch('/:id', asyncHandler(projectsController.updateProject.bind(projectsController)));

/**
 * @route   DELETE /api/projects/:id
 * @desc    Archive project (soft delete)
 * @access  Private (owner or admin only)
 */
router.delete('/:id', asyncHandler(projectsController.archiveProject.bind(projectsController)));

/**
 * @route   GET /api/projects/:id/members
 * @desc    Get project members
 * @access  Private (must be project member)
 */
router.get('/:id/members', asyncHandler(projectsController.getMembers.bind(projectsController)));

/**
 * @route   POST /api/projects/:id/members
 * @desc    Add member to project
 * @access  Private (owner or manager only)
 */
router.post('/:id/members', asyncHandler(projectsController.addMember.bind(projectsController)));

/**
 * @route   DELETE /api/projects/:id/members
 * @desc    Remove member from project
 * @access  Private (owner or manager only)
 */
router.delete('/:id/members', asyncHandler(projectsController.removeMember.bind(projectsController)));

export default router;
