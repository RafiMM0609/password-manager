import { aesGcmEncrypt, aesGcmDecrypt } from './helpers';

async function testEncryptionDecryption() {
  const plainText = 'Hello, Password Manager!';
  const password = 'strongpassword123';

  try {
    // Encrypt
    const encrypted = await aesGcmEncrypt(plainText, password);
    console.log('Encrypted:', encrypted);

    // Decrypt
    const decrypted = await aesGcmDecrypt(encrypted, password);
    console.log('Decrypted:', decrypted);

    // Check
    if (decrypted === plainText) {
      console.log('Test passed: Decrypted text matches original.');
    } else {
      console.error('Test failed: Decrypted text does not match original.');
    }
  } catch (e) {
    console.error('Error during test:', e);
  }
}

testEncryptionDecryption();
