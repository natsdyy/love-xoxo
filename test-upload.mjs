import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const storage = new Storage({
  keyFilename: 'lovexoxo-603f9-firebase-adminsdk-fbsvc-f00802b754.json',
});

const bucketName = 'lovexoxo-603f9.firebasestorage.app';

async function testUpload() {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file('test-upload.txt');
    await file.save('Hello Firebase Storage from Node!');
    fs.writeFileSync('test-upload-result.txt', 'Successfully uploaded a text file to ' + bucketName);
  } catch (error) {
    fs.writeFileSync('test-upload-result.txt', 'Failed on firebasestorage.app: ' + error.message);
    
    // Fallback to appspot.com
    try {
      const bucket2 = storage.bucket('lovexoxo-603f9.appspot.com');
      const file2 = bucket2.file('test-upload.txt');
      await file2.save('Hello Firebase from Node!');
      fs.appendFileSync('test-upload-result.txt', '\nBut successfully uploaded to appspot.com!');
    } catch (e2) {
      fs.appendFileSync('test-upload-result.txt', '\nFailed on appspot.com as well: ' + e2.message);
    }
  }
}

testUpload();
