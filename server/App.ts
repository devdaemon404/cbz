import { Request, Response } from 'express';
import next from 'next';
import chalk from 'chalk';
import https from 'https';
import fs from 'fs';
import expressServer from './server';
import { logger } from './utils/logger';

import * as config from './config/keys';

export class App {
  public async start() {
    const PORT: number | string = process.env.PORT || 3000;

    logger.info(chalk`Loaded {yellow.bold ${process.env.NODE_ENV}} config : `);

    for (let cf in config) {
      logger.info(chalk`{green ${cf} =} {grey ${config[cf]}}`);
    }

    const dev: boolean = process.env.NODE_ENV === 'development';

    const nextApp = next({ dev });

    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    expressServer.get('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    if (dev) {
      const server = https.createServer(
        {
          key: fs.readFileSync(
            `${__dirname}/../dev.app.cloudsbuzz.in+5-key.pem`,
            'utf8',
          ),
          cert: fs.readFileSync(
            `${__dirname}/../dev.app.cloudsbuzz.in+5.pem`,
            'utf8',
          ),
        },
        expressServer,
      );
      server.listen(PORT, () => {
        logger.info(
          chalk`{yellow.bold Server running in} ${process.env.NODE_ENV} {yellow.bold mode on port} ${PORT}`,
        );
      });
    } else {
      expressServer.listen(PORT);
    }
  }
}

const app: App = new App();

app.start();
