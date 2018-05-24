import { CloudFront } from 'aws-sdk';
import { Context, S3Handler, S3Event } from 'aws-lambda';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

import { AppConfig } from './AppConfig';

const cf = new CloudFront();
const config = new AppConfig();

export const handler: S3Handler = (event: S3Event) => {

};
