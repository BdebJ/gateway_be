import { Router } from 'express';
import { echoUploadController } from '../controllers/standardController';

const router: Router = Router();

router.post('/echo-upload', echoUploadController);

export default router;
