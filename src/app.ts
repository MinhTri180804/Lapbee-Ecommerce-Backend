import express from 'express';
import morgan from 'morgan';
import { ErrorMiddlewareHandler } from './middleware/errorHandler.middleware.js';
import { router as authRouter } from './routes/auth/index.route.js';

const app = express();

// Initial middleware
app.use(express.json());
app.use(morgan('dev'));

// Initial routes
app.use('/auth', authRouter);

app.use(ErrorMiddlewareHandler.handler.bind(ErrorMiddlewareHandler));

export default app;
