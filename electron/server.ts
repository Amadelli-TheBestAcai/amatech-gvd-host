import { S3 } from 'aws-sdk';
import decompress from 'decompress';
import rimraf from 'rimraf';
import path from 'path';
import { execSync } from 'child_process'

import serverJson from './src/constants/aws.json';

const dirServer = path.resolve(process.env.APPDATA as string, 'gvd_server')

async function listObjects(): Promise<any[]> {
  const s3 = new S3({
    accessKeyId: serverJson.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverJson.AWS_SECRET_ACCESS_KEY,
  });
  return new Promise((resolve, reject) => {
    s3.listObjects(
      {
        Bucket: serverJson.AWS_S3_BUCKET,
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(
          //@ts-ignore
          data.Contents.sort(function (first, second) {
            //@ts-ignore
            return new Date(second.LastModified) - new Date(first.LastModified);
          }),
        );
      },
    );
  });
}

export async function deleteOldServerFiles() {
  rimraf(path.resolve(dirServer, "package.json"), () => console.log('The old package.json was deleted'));
  rimraf(path.resolve(dirServer, "yarn.lock"), () => console.log('The old yarn.lock was deleted'));
  rimraf(path.resolve(dirServer, "src"), () => console.log('The old src folder was deleted'));
}

export async function downloadLastVersion() {
  return new Promise(async (resolve, reject) => {
    const s3 = new S3({
      accessKeyId: serverJson.AWS_ACCESS_KEY_ID,
      secretAccessKey: serverJson.AWS_SECRET_ACCESS_KEY,
    });
    const objects = await listObjects();
    const lastObject = objects[0];
    s3.getObject(
      {
        Bucket: serverJson.AWS_S3_BUCKET,
        Key: lastObject.Key,
      },
      async (err, data) => {
        if (err) {
          reject(console.log(err));
        }
        await deleteOldServerFiles()
        await decompress(data.Body, dirServer);
        resolve(console.log(`The server was downloaded in \n${dirServer}`));
      },
    );
  })
}

export function startServer() {
  execSync(`npm --prefix ${dirServer} start -y`)
}

export function stopServer() {
  execSync(`npm --prefix ${dirServer} run stop -y`)
}
