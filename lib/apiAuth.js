import { cookies } from 'next/headers';
import { verifySessionToken } from './session';

export async function requireSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!session || session.usertype !== 'admin') return null;
  return session;
}

// 'social' accounts are restricted to Daily Records Analytics only — every other
// route (clients, appointments, leads, daily record entries, etc.) should use this
// instead of requireSession() so a social account can't reach them via direct API calls.
export async function requireFullAccess() {
  const session = await requireSession();
  if (!session || session.usertype === 'social') return null;
  return session;
}
