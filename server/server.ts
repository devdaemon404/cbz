import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';

import morgan from 'morgan';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import errorHandler from './middleware/error';
import dbConnect from './db/dbConnect';
import { logger } from './utils/logger';

import auth from './routes/auth';
import admin from './routes/admin';
import employee from './routes/employee';
import timesheet from './routes/timesheet';
import file from './routes/file';
import workOrder from './routes/workOrder';
import task from './routes/task';
import vendor from './routes/vendor';
import invoice from './routes/invoice';
import dashboard from './routes/dashboard';
import demand from './routes/demand';

// Connect to mongoDB instance
dbConnect();

// Initializing express app object
const app: Express = express();

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('short', {
      stream: {
        write(message, encoding) {
          logger.info(message);
        },
      },
    }),
  );
}

// Body parser for parsing form data
app.use(express.urlencoded({ extended: true }));

// Body parser for parsing json
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Trust reverse proxy for heroku, nginx
app.set('trust proxy', 1);

// // Rate limiting
// if (process.env.RATE_LIMIT === 'true') {
//     const limiter: Object = rateLimit({
//         windowMs: 10 * 60 * 1000, // 10 mins
//         max: 100,
//     });
//     app.use(limiter);
// }

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v2/auth', auth);
app.use('/api/v2/admin', admin);
app.use('/api/v2/employee', employee);
app.use('/api/v2/timesheet', timesheet);
app.use('/api/v2/file', file);
app.use('/api/v2/work-order', workOrder);
app.use('/api/v2/task', task);
app.use('/api/v2/vendor', vendor);
app.use('/api/v2/invoice', invoice);
app.use('/api/v2/dashboard', dashboard);
app.use('/api/v2/demand', demand);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CloudsBuzz API',
    version: '1.0.0',
    description: 'REST API for CloudsBuzz',
    license: {
      name: 'Licensed Under Onpar',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Onpar',
      url: 'https://onpar.in',
    },
  },
  servers: [
    {
      url: '/',
      description: 'CB Development Server v2',
    },
    {
      url: 'https://test.app.cloudsbuzz.in',
      description: 'CB Deployed Server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api/v2/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handling Middleware
app.use(errorHandler);

export default app;
