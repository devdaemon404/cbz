import chalk from 'chalk';

import { Logger, createLogger, transports, format } from 'winston';

export class OPLogger {
  winstonLogger: Logger;

  constructor(private fileName: string = 'default') {
    this.winstonLogger = this.initializeWinston(fileName);
  }

  initializeWinston(fileName: string): Logger {
    const dateFormat = () => {
      return new Date(Date.now()).toUTCString();
    };

    const myFormat = format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        let msg = `${dateFormat()} [${level}] : ${message}`;
        return msg;
      }
    );
    return createLogger({
      format: format.combine(myFormat),
      transports: [
        new transports.Console(),
        new transports.File({ filename: `logs/${fileName}.log` }),
      ],
    });
  }

  private log(winstonLog: Function, consoleLog: Function, msg: string) {
    if (process.env.NODE_ENV === 'production') {
      return winstonLog(msg);
    }
    consoleLog(msg);
  }

  error(msg: string) {
    this.log(this.winstonLogger.error, console.error, chalk.redBright(msg));
  }

  info(msg: string) {
    this.log(this.winstonLogger.info, console.info, chalk.cyanBright(msg));
  }

  warn(msg: string) {
    this.log(this.winstonLogger.warn, console.warn, chalk.yellowBright(msg));
  }
}

export const logger = new OPLogger();
