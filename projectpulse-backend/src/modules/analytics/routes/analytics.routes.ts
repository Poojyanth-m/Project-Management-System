import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

router.use(authenticate);

// Global Dashboard
router.get('/dashboard', asyncHandler(analyticsController.getDashboardStats.bind(analyticsController)));

// Project Specific
router.get('/project', asyncHandler(analyticsController.getProjectAnalytics.bind(analyticsController)));

export default router;
