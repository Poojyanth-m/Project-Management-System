import { Router } from 'express';
import { filesController } from '../controllers/files.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

router.use(authenticate);

// Get presigned URL for upload
router.post('/upload-url', asyncHandler(filesController.getUploadUrl.bind(filesController)));

// Confirm upload (after sending file to cloud)
router.post('/confirm', asyncHandler(filesController.confirmUpload.bind(filesController)));

// Get files for entity
router.get('/', asyncHandler(filesController.getFiles.bind(filesController)));

// Delete file
router.delete('/:id', asyncHandler(filesController.deleteFile.bind(filesController)));

export default router;
