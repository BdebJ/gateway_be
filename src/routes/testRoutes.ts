import { Router } from 'express';
import {
  delayController,
  echoRequestController,
  fibonacciController,
  healthController,
  pingController,
  reverseStringController,
  statusCodeController
} from '../controllers/testController';

const router: Router = Router();

router.get('/ping', pingController);
router.get('/fibonacci/:limit', fibonacciController);
router.get('/echo-request', echoRequestController);
router.get('/health', healthController);
router.get('/status/:code', statusCodeController);
router.get('/delay/:ms', delayController);
// router.get('/cache');

router.post('/reverse-string', reverseStringController);
// router.post('/upload');

export default router;
