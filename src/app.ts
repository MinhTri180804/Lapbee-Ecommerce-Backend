import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

const app = express();

// Initial middleware
app.use(express.json());
app.use(morgan('dev'));

// Initial routes
app.use('/', (_, response) => {
  response.status(200).json({ message: 'Welcome to server !' });
});

console.log(process.env.APP_PORT);
console.log(process.env.A);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error);
  console.log(request);
  console.log(response);
  console.log(next);
  response.status(500).json({
    message: 'Error something in server'
  });
});

export default app;
