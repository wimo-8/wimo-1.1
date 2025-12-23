import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';
import { addDays, isBefore } from 'date-fns';

const SESSION_COOKIE = 'sooqiq_session';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session) return null;
  if (isBefore(session.expiresAt, new Date())) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
  return session.user;
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = addDays(new Date(), 7);
  await prisma.session.create({ data: { userId, token, expiresAt } });
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
}

export async function destroySession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}
