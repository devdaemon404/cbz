import AWS from 'aws-sdk';
AWS.config.setPromisesDependency(Promise);
import { awsS3AccessKeyId, awsS3SecretAccessKey } from '../config/keys';

type AwsS3Config = {
  Bucket: string;
  Expires?: number;
  ContentType?: string;
  ResponseContentType?: string;
  Key: string;
};

class AwsS3 {
  s3 = new AWS.S3({
    accessKeyId: awsS3AccessKeyId,
    secretAccessKey: awsS3SecretAccessKey,
    signatureVersion: 'v4',
    region: 'ap-south-1',
  });

  async getSignedUrl(requestMethod: string, config: AwsS3Config) {
    try {
      const signedUrl = await this.s3.getSignedUrlPromise(
        requestMethod,
        config,
      );
      return signedUrl;
    } catch (error) {
      console.log(error);
    }
  }
}

export { AwsS3 };
