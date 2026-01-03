import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// Generate a secure random license key
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = '';
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(crypto.randomBytes(1)[0] % chars.length));
    }
    if (i < 3) key += '-';
  }
  
  return key;
}

// Generate checksum for license key validation
export function generateChecksum(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex').substring(0, 8);
}

// Validate license key format
export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(key);
}

// Generate HWID hash from hardware components
export function generateHWIDHash(components: Record<string, string>): string {
  const componentsString = Object.entries(components)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return CryptoJS.SHA256(componentsString).toString();
}

// Encrypt sensitive data
export function encryptData(data: string, secret: string): string {
  return CryptoJS.AES.encrypt(data, secret).toString();
}

// Decrypt sensitive data
export function decryptData(encryptedData: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate API key
export function generateAPIKey(): string {
  return crypto.randomBytes(32).toString('hex');
}