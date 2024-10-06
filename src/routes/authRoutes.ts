import { Router } from 'express';
import { authTestController, loginController, logoutController, refreshController, registerController } from '../controllers/authController';
import { authHandler } from '../middlewares/authHandler';

const router: Router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);

router.use(authHandler);
router.post('/logout', logoutController);
router.get('/auth-test', authTestController);

export default router;
