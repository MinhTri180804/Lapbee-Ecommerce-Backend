import express from 'express';
import morgan from 'morgan';
import { ErrorMiddlewareHandler } from './middleware/errorHandler.middleware.js';
import { router as authRouter } from './routes/auth/index.route.js';
import { router as userProfileRouter } from './routes/userProfile.routes.js';
import { router as uploadRouter } from './routes/upload/index.routes.js';
import { router as brandRouter } from './routes/brand.routes.js';
import { router as categoryRouter } from './routes/category.route.js';
import { router as productRouter } from './routes/product.routes.js';

const app = express();

// Initial middleware
app.use(express.json());
app.use(morgan('dev'));

// Initial routes
app.use('/auth', authRouter);
app.use('/profile', userProfileRouter);
app.use('/upload', uploadRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

app.use(ErrorMiddlewareHandler.handler.bind(ErrorMiddlewareHandler));

export default app;
