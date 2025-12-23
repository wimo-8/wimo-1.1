'use server';

import { prisma } from '@/lib/prisma';
import { createOtp, verifyOtp, isValidIraqiPhone } from '@/lib/otp';
import { createSession } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { PaymentMethod, OrderStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

export async function requestOtp(formData: FormData) {
  const phone = (formData.get('phone') as string) || '';
  if (!isValidIraqiPhone(phone)) {
    return { error: 'رقم غير صحيح أو غير مدعوم' };
  }
  await createOtp(phone);
  return { success: 'تم إرسال رمز التفعيل (خلال التطوير الرمز ثابت 000000)' };
}

export async function confirmOtp(formData: FormData) {
  const phone = (formData.get('phone') as string) || '';
  const code = (formData.get('code') as string) || '';
  if (!(await verifyOtp(phone, code))) {
    return { error: 'رمز غير صحيح أو منتهي' };
  }
  const user = await prisma.user.upsert({ where: { phone }, update: {}, create: { phone, name: 'مستخدم سوقIQ' } });
  await createSession(user.id);
  return { success: 'تم تسجيل الدخول' };
}

export async function checkoutAction(formData: FormData) {
  const data = {
    productId: (formData.get('productId') as string) || '',
    paymentMethod: (formData.get('paymentMethod') as string) as keyof typeof PaymentMethod,
    phone: (formData.get('phone') as string) || '',
    otp: (formData.get('otp') as string) || undefined,
    note: (formData.get('note') as string) || undefined,
    reference: (formData.get('reference') as string) || undefined,
  };
  const parse = checkoutSchema.safeParse(data);
  if (!parse.success) {
    return { error: 'البيانات غير مكتملة' };
  }
  const { paymentMethod, phone, otp } = parse.data;
  const user = await prisma.user.upsert({ where: { phone }, update: {}, create: { phone, name: 'زبون سريع' } });
  if (process.env.NODE_ENV === 'development') {
    await createSession(user.id);
  } else if (otp) {
    const ok = await verifyOtp(phone, otp);
    if (!ok) return { error: 'رمز التحقق مطلوب' };
    await createSession(user.id);
  }
  const product = await prisma.product.findUnique({ where: { id: parse.data.productId } });
  if (!product) return { error: 'المنتج غير موجود' };

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      paymentMethod,
      status: OrderStatus.RECEIVED,
      total: product.price,
      items: {
        create: [{ productId: product.id, quantity: 1, unitPrice: product.price }],
      },
      timeline: { create: [{ status: OrderStatus.RECEIVED, message: 'تم استلام الطلب ✅' }] },
      paymentProofs: parse.data.reference
        ? { create: [{ imageUrl: '/placeholder.svg', note: parse.data.reference }] }
        : undefined,
    },
  });

  revalidatePath('/orders');
  return { success: 'تم إنشاء الطلب', orderId: order.id };
}
