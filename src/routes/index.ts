import { Router } from 'express';
import authRoutes from './authRoutes';
import testRoutes from './testRoutes';

const routes: Router = Router();

routes.use('/auth', authRoutes);
routes.use('/test', testRoutes);

export default routes;
