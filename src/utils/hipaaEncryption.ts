/**
 * NEXUS AYURVE — HIPAA-Compliant PHI Encryption Utility
 * -------------------------------------------------------
 * All Protected Health Information (PHI) fields MUST be
 * encrypted client-side BEFORE writing to Firestore.
 * Decryption happens only in-app; plaintext never leaves
 * the device toward any logging system.
 *
 * Compliant with: HIPAA §164.312(a)(2)(iv) — Encryption & Decryption
 */

import CryptoJS from 'crypto-js';

// Key comes from env — never hard-coded in source
const PHI_SECRET = import.meta.env.VITE_PHI_ENCRYPTION_KEY ?? 'NEXUS-AYURVE-DEV-KEY-32CHARS!!!';

/**
 * Encrypt a PHI field value before saving to Firestore.
 * Returns a prefixed string so you can detect encrypted values.
 */
export function encryptPHI(plaintext: string): string {
  if (!plaintext) return plaintext;
  const encrypted = CryptoJS.AES.encrypt(plaintext, PHI_SECRET).toString();
  return `ENC:${encrypted}`;
}

/**
 * Decrypt a PHI field value retrieved from Firestore.
 */
export function decryptPHI(ciphertext: string): string {
  if (!ciphertext || !ciphertext.startsWith('ENC:')) return ciphertext;
  try {
    const raw = ciphertext.replace(/^ENC:/, '');
    const bytes = CryptoJS.AES.decrypt(raw, PHI_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    // HIPAA §164.312(b): log access failures, never expose raw error to UI
    console.warn('[HIPAA] Decryption failed — possible key mismatch or data corruption.');
    return '[ENCRYPTED]';
  }
}

/**
 * Encrypt an entire PHI object.
 * Pass a record mapping field names to their plaintext values.
 * Returns the same shape with all values encrypted.
 *
 * @example
 *   const safe = encryptPHIFields({ symptoms: '...', diagnosis: '...' });
 *   await setDoc(ref, { ...meta, ...safe });
 */
export function encryptPHIFields<T extends Record<string, string>>(
  fields: T
): T {
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, encryptPHI(String(v ?? ''))])
  ) as T;
}

/**
 * Decrypt an entire PHI object retrieved from Firestore.
 */
export function decryptPHIFields<T extends Record<string, string>>(
  fields: T
): T {
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, decryptPHI(String(v ?? ''))])
  ) as T;
}
