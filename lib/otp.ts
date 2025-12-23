import { prisma } from './prisma';
import { addMinutes, isBefore } from 'date-fns';

const DEV_OTP = process.env.OTP_STATIC || '000000';
const WHITELIST = ['0770', '0771', '0772', '0780', '0781', '0782', '0750', '0751'];

export function isValidIraqiPhone(phone: string) {
  const normalized = phone.replace(/\s|-/g, '');
  const pattern = /^(\+964|0)?7[0-9]{9}$/;
  const prefix = normalized.startsWith('+964') ? normalized.slice(4, 7) : normalized.slice(0, 3);
  return pattern.test(normalized) && WHITELIST.some((p) => normalized.startsWith(p) || normalized.startsWith(`+964${p.slice(1)}`));
}

export async function createOtp(phone: string) {
  const expiresAt = addMinutes(new Date(), 5);
  const code = process.env.NODE_ENV === 'development' ? DEV_OTP : Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.oTP.create({ data: { phone, code, expiresAt } });
  console.log('OTP for', phone, code);
  return code;
}

export async function verifyOtp(phone: string, code: string) {
  const record = await prisma.oTP.findFirst({
    where: { phone, code, consumed: false },
    orderBy: { createdAt: 'desc' },
  });
  if (!record) return false;
  if (isBefore(record.expiresAt, new Date())) return false;
  await prisma.oTP.update({ where: { id: record.id }, data: { consumed: true } });
  return true;
}
