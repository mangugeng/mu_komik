const crypto = require('crypto');

function getJakartaTimestamp() {
  const now = new Date();
  const offset = 7 * 60; // +07:00
  const local = new Date(now.getTime() + (offset + now.getTimezoneOffset()) * 60000);
  const pad = n => n.toString().padStart(2, '0');
  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}+07:00`;
}

// === ISI DATA DI BAWAH INI ===
const clientSecret = 'YOUR_DOKU_SECRET';
const accessToken = 'ACCESS_TOKEN_DARI_DOKU';
const method = 'POST';
const urlPath = '/snap-adapter/b2b/v1.0/qr/qr-mpm-generate';
const timestamp = getJakartaTimestamp(); // Otomatis waktu sekarang
const requestBody = {
  partnerReferenceNo: 'INV1234567890',
  amount: { value: 10000, currency: 'IDR' },
  feeAmount: { value: 0, currency: 'IDR' }
};
// =============================

// 1. Minify JSON body
const minifiedBody = JSON.stringify(requestBody);
// 2. SHA-256 hash, hex, lowercase
const bodyHash = crypto.createHash('sha256').update(minifiedBody).digest('hex').toLowerCase();
// 3. String to sign
const stringToSign = `${method}:${urlPath}:${accessToken}:${bodyHash}:${timestamp}`;
// 4. HMAC SHA-512
const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

console.log('Timestamp:', timestamp);
console.log('Body hash:', bodyHash);
console.log('String to sign:', stringToSign);
console.log('Signature:', signature); 