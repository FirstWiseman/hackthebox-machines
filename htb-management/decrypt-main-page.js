
const fs = require("node:fs");
const crypto = require("node:crypto");

const KEY = "C+XDTUB0EuPY7BE+xzRcMP6dNjWd0h0GPxdt8tWSTVY=";

const input = process.argv[2] || "app.enc";
const output = process.argv[3] || "app_decrypted.js";

try {
  // Read Base64-encoded file
  const encoded = fs.readFileSync(input, "utf8").trim();
  const raw = Buffer.from(encoded, "base64");

  // Decode AES-256 key
  const key = Buffer.from(KEY, "base64");

  // Extract IV, ciphertext and authentication tag
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(raw.length - 16);
  const ciphertext = raw.subarray(12, raw.length - 16);

  // Decrypt using AES-256-GCM
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  // Save decrypted JavaScript without executing it
  fs.writeFileSync(output, decrypted);

  console.log(`[+] Successfully decrypted ${input}`);
  console.log(`[+] Algorithm: AES-256-GCM`);
  console.log(`[+] Output: ${output}`);
  console.log(`[+] Size: ${decrypted.length} bytes`);
} catch (err) {
  console.error("[-] Decryption failed:", err.message);
  process.exit(1);
}

