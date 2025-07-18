const crypto = require('crypto');
const axios = require('axios');

// === ISI DATA DI BAWAH INI ===
const clientId = process.env.DOKU_CLIENT_ID;
const secret = process.env.DOKU_SECRET;
const partnerReferenceNo = 'INV1234567890'; // Harus unik setiap request
const amountValue = 10000; // Nominal QRIS
const feeValue = 0; // Fee QRIS
// =============================

function getJakartaTimestamp() {
  const now = new Date();
  const offset = 7 * 60; // +07:00
  const local = new Date(now.getTime() + (offset + now.getTimezoneOffset()) * 60000);
  const pad = n => n.toString().padStart(2, '0');
  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}+07:00`;
}

async function getDokuAccessToken(clientId, secret) {
  const url = 'https://api-sandbox.doku.com/identity/v1/oauth2/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  const res = await axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
    }
  });
  return res.data.access_token;
}

function generateDokuSignature({ method, urlPath, accessToken, requestBody, timestamp, clientSecret }) {
  const minifiedBody = JSON.stringify(requestBody);
  const bodyHash = crypto.createHash('sha256').update(minifiedBody).digest('hex').toLowerCase();
  const stringToSign = `${method}:${urlPath}:${accessToken}:${bodyHash}:${timestamp}`;
  const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');
  return { signature, stringToSign, bodyHash };
}

async function main() {
  const url = 'https://api-sandbox.doku.com/snap-adapter/b2b/v1.0/qr/qr-mpm-generate';
  const urlPath = '/snap-adapter/b2b/v1.0/qr/qr-mpm-generate';
  const timestamp = getJakartaTimestamp();
  const requestBody = {
    partnerReferenceNo,
    amount: { value: amountValue, currency: 'IDR' },
    feeAmount: { value: feeValue, currency: 'IDR' }
  };
  try {
    // 1. Ambil access token
    const accessToken = await getDokuAccessToken(clientId, secret);
    // 2. Generate signature
    const { signature, stringToSign, bodyHash } = generateDokuSignature({
      method: 'POST',
      urlPath,
      accessToken,
      requestBody,
      timestamp,
      clientSecret: secret,
    });
    // 3. Kirim request generate QRIS
    const headers = {
      'X-PARTNER-ID': clientId,
      'X-TIMESTAMP': timestamp,
      'X-EXTERNAL-ID': partnerReferenceNo,
      'X-SIGNATURE': signature,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log('Request headers:', headers);
    console.log('Request body:', requestBody);
    console.log('String to sign:', stringToSign);
    console.log('Body hash:', bodyHash);
    console.log('Signature:', signature);
    const response = await axios.post(url, requestBody, { headers });
    console.log('DOKU QRIS response:', response.data);
  } catch (e) {
    if (e.response) {
      console.error('DOKU QRIS error:', e.response.data);
    } else {
      console.error('DOKU QRIS error:', e.message);
    }
  }
}

main(); 