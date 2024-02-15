const {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const fs = require('fs');

const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new S3Client({
  endpoint: 'https://s3.storage.selcloud.ru',
  s3ForcePathStyle: true,
  region: 'ru-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
  },
  apiVersion: 'latest',
});

const objectKey = 'objectkey';
const copyObjectKey = 'objectkeycopy';
const bucketParams = { Bucket: BUCKET_NAME };

const uploadParams = {
  Bucket: bucketParams.Bucket,
  Key: '',
  Body: '',
};

const createParams = {
  Bucket: bucketParams.Bucket,
  Key: objectKey,
  Body: 'test_body123',
};
const metaParams = { Bucket: bucketParams.Bucket, Key: objectKey };
const copyParams = {
  Bucket: bucketParams.Bucket,
  CopySource: `${bucketParams.Bucket}/${objectKey}`,
  Key: copyObjectKey,
};

const deletePhoto = async (key) => {
  const input = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(input);

  try {
    await s3.send(command);
    console.log('Object deleted successfully:', key);
  } catch (e) {
    console.error('Error deleting object:', e);
    throw e;
  }
};

module.exports = {
  s3,
  ListObjectsV2Command,
  BUCKET_NAME,
  deletePhoto,
};
