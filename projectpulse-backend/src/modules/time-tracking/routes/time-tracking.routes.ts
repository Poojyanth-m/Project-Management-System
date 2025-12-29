import { Router } from 'express';
import { timeTrackingController } from '../controllers/time-tracking.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

router.use(authenticate);

// Start timer
router.post('/start', asyncHandler(timeTrackingController.startTimer.bind(timeTrackingController)));

// Stop timer
router.post('/stop', asyncHandler(timeTrackingController.stopTimer.bind(timeTrackingController)));

// Manual entry
router.post('/manual', asyncHandler(timeTrackingController.createManualEntry.bind(timeTrackingController)));

// Get entries
router.get('/', asyncHandler(timeTrackingController.getTimeEntries.bind(timeTrackingController)));

// Get running timer
router.get('/running', asyncHandler(timeTrackingController.getRunningTimer.bind(timeTrackingController)));

export default router;
