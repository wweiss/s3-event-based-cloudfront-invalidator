import { CloudFront } from 'aws-sdk';
import { Context, S3Handler, S3Event } from 'aws-lambda';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

import { AppConfig } from './AppConfig';

const cf = new CloudFront();
const config = new AppConfig();

export const handler: S3Handler = (event: S3Event) => {
  const paths = config.invalidationPaths;
  if (paths.length < 1) {
    event.Records.map(rec => paths.push(rec.s3.object.key));
  }

  const params = {
    DistributionId: config.distributionId,
    InvalidationBatch: {
      CallerReference: '',
      Paths: {
        Quantity: paths.length,
        Items: paths
      }
    }
  };

  cf.createInvalidation(params, (err, data) => {
    if (err) {
      console.error('Error creating invalidation: ', err);
    } else {
      console.info('Invalidation created successfully: ', data);
    }
  });
};
