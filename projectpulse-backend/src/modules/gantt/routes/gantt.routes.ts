import { Router } from 'express';
import { ganttController } from '../controllers/gantt.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

router.use(authenticate);

// Get Gantt Data (Tasks + Dependencies)
router.get('/', asyncHandler(ganttController.getProjectGantt.bind(ganttController)));

// Add Dependency
router.post('/dependencies', asyncHandler(ganttController.addDependency.bind(ganttController)));

// Remove Dependency
router.delete('/dependencies', asyncHandler(ganttController.removeDependency.bind(ganttController)));

export default router;
