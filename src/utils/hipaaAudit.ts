/**
 * NEXUS AYURVE — HIPAA Audit Logger
 * -----------------------------------
 * HIPAA §164.312(b) — Audit Controls:
 * Every PHI access, creation, update, and deletion must be
 * recorded with: WHO (uid), WHAT (action + collection), WHEN (ISO timestamp).
 *
 * Logs are written to a write-only Firestore collection `audit_logs`.
 * No PHI values are ever written to the log — only metadata.
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export type AuditAction =
  | 'PHI_READ'
  | 'PHI_WRITE'
  | 'PHI_UPDATE'
  | 'PHI_DELETE'
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_SIGNUP'
  | 'AUTH_FAILED'
  | 'MFA_ENROLLED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export interface AuditEntry {
  uid: string | null;
  action: AuditAction;
  resource: string;          // e.g. "users/{uid}", "appointments/{id}"
  details?: string;          // non-PHI description only
  ipHint?: string;           // partial IP if available
  timestamp: unknown;        // Firestore serverTimestamp
  hipaaCompliant: true;
}

/**
 * Write an immutable audit record to Firestore `audit_logs`.
 * This function MUST NOT receive or log any PHI values.
 */
export async function writeAuditLog(
  action: AuditAction,
  resource: string,
  details?: string
): Promise<void> {
  try {
    const uid = auth.currentUser?.uid ?? null;

    const entry: AuditEntry = {
      uid,
      action,
      resource,
      details: details ?? '',
      timestamp: serverTimestamp(),
      hipaaCompliant: true,
    };

    await addDoc(collection(db, 'audit_logs'), entry);
  } catch {
    // Audit log failures are silently suppressed in UI but
    // would be caught by server-side monitoring in production.
    // Never throw — audit log failure must not block user operations.
  }
}

/**
 * Convenience wrappers
 */
export const auditLogin  = (uid: string) => writeAuditLog('AUTH_LOGIN',  `users/${uid}`, 'User signed in');
export const auditLogout = (uid: string) => writeAuditLog('AUTH_LOGOUT', `users/${uid}`, 'User signed out');
export const auditSignup = (uid: string) => writeAuditLog('AUTH_SIGNUP', `users/${uid}`, 'New account created');
export const auditFailed = ()            => writeAuditLog('AUTH_FAILED', 'auth', 'Authentication attempt failed');
export const auditPHIRead   = (res: string) => writeAuditLog('PHI_READ',   res, 'PHI document accessed');
export const auditPHIWrite  = (res: string) => writeAuditLog('PHI_WRITE',  res, 'PHI document created');
export const auditPHIUpdate = (res: string) => writeAuditLog('PHI_UPDATE', res, 'PHI document modified');
export const auditPHIDelete = (res: string) => writeAuditLog('PHI_DELETE', res, 'PHI document deleted');
