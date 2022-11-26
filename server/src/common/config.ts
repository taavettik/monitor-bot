import fs from 'fs/promises';

async function readSecret(secret: string) {
  // kubernetes mounts secrets at /run/secrets/SECRET/secret
  const paths = [`/run/secrets/${secret}`, `/run/secrets/${secret}/secret`];

  for (const path of paths) {
    try {
      const data = await fs.readFile(path, 'utf8');

      return data;
    } catch {}
  }

  console.warn(`Warning: couldn't read secret ${secret}`);
}

const secretMap = {
  BOT_TOKEN: true,
  RTSP_URL: true,
} as const;

type Secrets = {
  [key in keyof typeof secretMap]: typeof secretMap[key] extends true
    ? string
    : string | undefined;
};

let secrets: Secrets | null = null;

export async function readSecrets() {
  if (secrets) {
    return secrets;
  }

  const entries = await Promise.all(
    Object.entries(secretMap).map(async ([key, val]) =>
      val ? [key, await readSecret(key)] : undefined,
    ),
  );

  secrets = entries.reduce(
    (obj, entry) =>
      entry
        ? {
            ...obj,
            [entry[0] as any]: entry[1],
          }
        : {
            ...obj,
          },
    {} as Secrets,
  );

  return secrets;
}
