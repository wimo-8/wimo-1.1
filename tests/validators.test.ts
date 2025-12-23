import { describe, expect, it } from 'vitest';
import { phoneSchema, checkoutSchema } from '@/lib/validators';

describe('phone validation', () => {
  it('accepts Iraqi format', () => {
    expect(() => phoneSchema.parse('07701234567')).not.toThrow();
    expect(() => phoneSchema.parse('+9647701234567')).not.toThrow();
  });
  it('rejects invalid numbers', () => {
    expect(() => phoneSchema.parse('123')).toThrow();
  });
});

describe('checkout schema', () => {
  it('requires fields', () => {
    const parsed = checkoutSchema.safeParse({
      productId: '1',
      paymentMethod: 'BALANCE',
      phone: '07701234567',
      otp: '000000',
    });
    expect(parsed.success).toBe(true);
  });
});
