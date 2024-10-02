import { Router } from 'express';
import {
  delayController,
  echoRequestController,
  fibonacciController,
  healthController,
  pingController,
  reverseStringController,
  statusCodeController
} from '../controllers/standardController';

const router: Router = Router();

router.get('/ping', pingController);
router.get('/fibonacci/:limit', fibonacciController);
router.get('/echo-request', echoRequestController);
router.get('/health', healthController);
router.get('/status/:code', statusCodeController);
router.get('/delay/:ms', delayController);

router.post('/reverse-string', reverseStringController);

export default router;
