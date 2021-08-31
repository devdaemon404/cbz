import * as dotenv from 'dotenv';

dotenv.config();
let path;

// Load env vars according to NODE_ENV
switch (process.env.NODE_ENV) {
  case 'production':
    path = `${__dirname}/prod.env`;
    break;
  default:
    path = `${__dirname}/dev.env`;
}
dotenv.config({ path });

export const mongoUri = process.env.MONGO_URI;
export const pmURL = process.env.PM_URL;

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpire = process.env.JWT_EXPIRE;
export const jwtCookieExpire = process.env.JWT_COOKIE_EXPIRE;

export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = process.env.SMTP_PORT;
export const smtpEmail = process.env.SMTP_EMAIL;
export const smtpPassword = process.env.SMTP_PASSWORD;
export const fromName = process.env.FROM_NAME;
export const fromEmail = process.env.FROM_EMAIL;

export const awsS3AccessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
export const awsS3SecretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
export const v1ApiUrl = process.env.V1_API_URL;
export const v2ApiUrl = process.env.V2_API_URL;
