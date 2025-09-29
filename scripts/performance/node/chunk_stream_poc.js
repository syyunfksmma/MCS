import crypto from 'crypto';
import fs from 'fs';

export async function streamHash(filePath, chunkSize = 262144) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

if (import.meta.url === ile://) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node chunk_stream_poc.js <file>');
    process.exit(1);
  }
  streamHash(filePath)
    .then((hash) => console.log(SHA256: ))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
