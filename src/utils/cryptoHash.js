import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_CRYPTO_SECRET_KEY;
// Encrypt plaintext using AES
export function encryptText(plaintext) {
  return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
}

// Decrypt ciphertext back to plaintext
export function decryptText(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
