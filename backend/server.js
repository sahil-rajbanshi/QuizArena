import 'dotenv/config';
import app from './src/app.js';
import { testConnection } from './src/config/db.js';
import config from './src/config/env.js';

const startServer = async () => {
  try {
    await testConnection();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }
};

startServer();