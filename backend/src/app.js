import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import config from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import { errorResponse } from './utils/apiResponse.js';
import topicsRouter from './modules/topics/topics.routes.js';
import chaptersRouter from './modules/chapters/chapters.routes.js';
import questionsRouter from './modules/questions/questions.routes.js';
import optionsRouter from './modules/options/options.routes.js';
import progressRouter from './modules/progress/progress.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});
app.use('/api/auth', authRoutes);

// ... other middleware and routes
app.use('/api/topics', topicsRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/options', optionsRouter);
app.use('/api/progress', progressRouter);


// 404 handler for unmatched routes
app.use((req, res, next) => {
  errorResponse(res, 'Route not found', 404);
});

// Global error handler
app.use(errorHandler);



export default app;