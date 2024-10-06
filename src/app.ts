import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import standardRoutes from './routes/standardRoutes';
import unparsedRoutes from './routes/unparsedRoutes';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', unparsedRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', standardRoutes);

app.use(errorHandler);

export default app;
