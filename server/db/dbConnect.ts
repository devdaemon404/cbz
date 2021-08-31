import mongoose from 'mongoose';

import { logger } from '../utils/logger';
import { mongoUri } from '../config/keys';

const dbConnect = async () => {
  try {
    let mongooseOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
    const conn = await mongoose.connect(mongoUri, mongooseOptions);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error.message);
  }
};

export default dbConnect;
