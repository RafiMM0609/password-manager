
// AES-256-GCM encryption and decryption using Web Crypto API
// Usage: await aesGcmEncrypt(plainText, password), await aesGcmDecrypt(cipherData, password)

// Helper: Convert string to ArrayBuffer
function strToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}

// Helper: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a crypto key from password using PBKDF2
async function deriveKey(password, salt) {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    strToArrayBuffer(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt with AES-256-GCM
export async function aesGcmEncrypt(plainText, password) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const encoded = strToArrayBuffer(plainText);
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  // Return base64 encoded: salt + iv + ciphertext
  const result = new Uint8Array(salt.length + iv.length + cipherBuffer.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(cipherBuffer), salt.length + iv.length);
  return arrayBufferToBase64(result.buffer);
}

// Decrypt with AES-256-GCM
export async function aesGcmDecrypt(cipherTextBase64, password) {
  const data = new Uint8Array(base64ToArrayBuffer(cipherTextBase64));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const cipher = data.slice(28);
  const key = await deriveKey(password, salt);
  try {
    const plainBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipher
    );
    return new TextDecoder().decode(plainBuffer);
  } catch (e) {
    throw new Error('Decryption failed');
  }
}
