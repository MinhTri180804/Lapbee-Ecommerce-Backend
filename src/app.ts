import express from 'express';
import morgan from 'morgan';
import { ErrorMiddlewareHandler } from './middleware/errorHandler.middleware.js';
import { router as authRouter } from './routes/auth/index.route.js';
import { router as userProfileRouter } from './routes/userProfile.routes.js';
import { router as brandRouter } from './routes/brand.routes.js';
import { router as categoryRouter } from './routes/category.route.js';
import { router as productRouter } from './routes/product.routes.js';
import { router as cloudinaryRouter } from './routes/external/cloudinary/index.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CookieParser middleware
app.use(cookieParser());

// CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Initial middleware
app.use(express.json());
app.use(morgan('dev'));

// Initial routes
app.use('/auth', authRouter);
app.use('/profile', userProfileRouter);
app.use('/cloudinary', cloudinaryRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

app.use(ErrorMiddlewareHandler.handler.bind(ErrorMiddlewareHandler));

export default app;
