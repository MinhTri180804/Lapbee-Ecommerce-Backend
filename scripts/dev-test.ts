import winston from 'winston';
import { env } from '../src/configs/env.config.js';
import { MongooseManager } from '../src/configs/mongooseManager.config.js';
import app from '../src/app.js';

const PORT = env.app.PORT;

const logger = winston.createLogger({
  level: 'info'
});

const startApplication = async () => {
  try {
    console.log('Starting Lapbee E-Commerce application...');

    // Connecting mongoDB with mongoose
    const mongooseManager = MongooseManager.getInstance(logger);
    await mongooseManager.connect();

    // Start HTTP Server
    app.listen(PORT, (error) => {
      if (error) throw error;

      console.log(`Server running on port: ${PORT}`);
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start application...');
    console.error(`Error failed start application: `, error);
    process.exit(1);
  }
};

await startApplication();
