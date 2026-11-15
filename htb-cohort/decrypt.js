#!/usr/bin/env node
'use strict';

// Decrypt the AES-GCM payload embedded in the original browser script.
// IMPORTANT: This only writes the decrypted source. It never evaluates or runs it.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const inputPath = process.argv[2];
const outputPath = process.argv[3] || 'decrypted.js';

if (!inputPath) {
  console.error(`Usage: node ${path.basename(process.argv[1])} <encrypted-script.txt> [decrypted.js]`);
  process.exit(1);
}

try {
  const source = fs.readFileSync(inputPath, 'utf8');
  const b64Values = [...source.matchAll(/\bdecode\(\s*["']([A-Za-z0-9+/=]+)["']\s*\)/g)]
    .map(match => match[1]);

  if (b64Values.length !== 3) {
    throw new Error(`Expected 3 Base64 values (key, IV, ciphertext+tag); found ${b64Values.length}.`);
  }

  const [key, iv, encrypted] = b64Values.map(value => Buffer.from(value, 'base64'));
  const tagLength = 16; // Web Crypto AES-GCM default tagLength: 128 bits
  if (![16, 24, 32].includes(key.length)) throw new Error(`Invalid AES key length: ${key.length}`);
  if (encrypted.length <= tagLength) throw new Error('Encrypted payload is too short.');

  // Web Crypto includes the authentication tag at the END of its ciphertext.
  // Node's createDecipheriv expects it to be passed separately.
  const ciphertext = encrypted.subarray(0, -tagLength);
  const authTag = encrypted.subarray(-tagLength);
  const decipher = crypto.createDecipheriv(`aes-${key.length * 8}-gcm`, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  fs.writeFileSync(outputPath, decrypted);
  console.log(`Decrypted ${decrypted.length} bytes to ${path.resolve(outputPath)}`);
  console.log('Source saved only. It was NOT executed.');
} catch (error) {
  console.error(`Decryption failed: ${error.message}`);
  process.exitCode = 1;
}
