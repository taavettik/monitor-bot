import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import path from 'path';
import os from 'os';

function escape(str: string) {
  return str.replace(/"/g, '');
}

export async function fetchImage(rtspUrl: string) {
  const outPath = path.join(os.tmpdir(), `${uuid()}.jpg`);

  return new Promise<string>((resolve, reject) => {
    exec(
      `ffmpeg -y -rtsp_transport tcp -i "${escape(
        rtspUrl,
      )}" -vframes 1 -strftime 1 "${escape(outPath)}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        console.log(stdout);
        console.error(stderr);

        resolve(outPath);
      },
    );
  });
}
