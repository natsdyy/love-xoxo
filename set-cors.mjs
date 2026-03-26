import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const storage = new Storage({
  keyFilename: 'lovexoxo-603f9-firebase-adminsdk-fbsvc-f00802b754.json',
});

async function applyCors() {
  const bucketName = 'lovexoxo-603f9.appspot.com';
  const bucket = storage.bucket(bucketName);
  try {
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type'],
      },
    ]);
    fs.writeFileSync('buckets.txt', `Success applying CORS to ${bucketName}`);
  } catch (error) {
    fs.writeFileSync('buckets.txt', 'Error on appspot.com: ' + error.message);
  }
}

applyCors();
