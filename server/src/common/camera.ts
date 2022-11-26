import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import path from 'path';
import os from 'os';

function escape(str: string) {
  return str.replace(/"/g, '');
}

export async function fetchImage(rtspUrl: string) {
  const outPath = path.join(os.tmpdir(), `${uuid()}.jpg`);

  const cmd = `ffmpeg -y -rtsp_transport tcp -i ${escape(
    rtspUrl,
  )} -vframes 1 -strftime 1 "${escape(outPath)}"`;

  return new Promise<string>((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve(outPath);
    });
  });
}
