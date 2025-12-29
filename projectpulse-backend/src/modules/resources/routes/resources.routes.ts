import { Router } from 'express';
import * as resourcesController from '../controllers/resources.controller';

const router = Router();

router.get('/', resourcesController.getResources);
router.get('/stats', resourcesController.getStats);
router.post('/', resourcesController.createResource);
router.post('/allocate', resourcesController.allocateResource);
router.delete('/:id', resourcesController.deleteResource);
router.put('/:id', resourcesController.updateResource);

export default router;
