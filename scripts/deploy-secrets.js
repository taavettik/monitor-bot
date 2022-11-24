const fs = require('fs');
const { exec } = require('child_process');

function execute(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error(stderr)
      }

      resolve();
    })
  });
}

const secrets = require('../secrets.json');

const namespaceName = process.env["PROJECT_NAMESPACE"];

if (!namespaceName) {
  throw new Error(`Environment variable PROJECT_NAMESPACE not set`);
}

for (const secret in secrets) {
  const value = process.env[secret];

  if (!value) {
    console.warn(`Warning: value for secret ${secret} not found`);
    continue;
  }

  const secretName = secrets[secret];

  try {
    execute(`kubectl create secret generic ${secretName} -n ${namespaceName}`)
  } catch {}

  execute(`kubectl patch secret ${secretName} -n ${namespaceName} -p '${JSON.stringify({
    data: {
      secret: Buffer.from(value).toString('base64'),
    }
  })}'`);
}