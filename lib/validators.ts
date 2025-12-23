import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^(\+964|0)?7[0-9]{9}$/);

export const otpSchema = z.string().length(6).regex(/^[0-9]{6}$/);

export const checkoutSchema = z.object({
  productId: z.string().min(1),
  paymentMethod: z.enum(['BALANCE', 'QI_CARD', 'BANK_TRANSFER', 'WHATSAPP_CONFIRM']),
  phone: phoneSchema,
  otp: otpSchema.optional(),
  note: z.string().max(200).optional(),
  reference: z.string().max(100).optional(),
});
