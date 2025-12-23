import { prisma } from '@/lib/prisma';
import { checkoutAction } from '@/app/actions';
import { PaymentMethod } from '@prisma/client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { category: true } });
  if (!product) return notFound();

  const submitOrder = async (formData: FormData) => {
    'use server';
    await checkoutAction(formData);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-xs text-slate-500">{product.category?.name}</p>
        <h1 className="text-xl font-bold">{product.title}</h1>
        <p className="text-slate-700">{product.description}</p>
        <p className="mt-2 text-lg font-semibold text-primary">{product.price} ألف</p>
        <p className="text-sm text-slate-500">التجهيز خلال {product.fulfillmentHours} ساعة</p>
      </div>
      <form action={submitOrder} className="card space-y-3">
        <input type="hidden" name="productId" value={product.id} />
        <div>
          <label className="text-sm">رقم هاتفك</label>
          <input name="phone" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="07xxxxxxxx" required />
        </div>
        <div>
          <label className="text-sm">طريقة الدفع</label>
          <select name="paymentMethod" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value={PaymentMethod.BALANCE}>تحويل رصيد</option>
            <option value={PaymentMethod.QI_CARD}>Qi Card</option>
            <option value={PaymentMethod.BANK_TRANSFER}>تحويل مباشر</option>
            <option value={PaymentMethod.WHATSAPP_CONFIRM}>تأكيد واتساب</option>
          </select>
        </div>
        <div>
          <label className="text-sm">رقم العملية/ملاحظات</label>
          <input name="reference" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="اختياري" />
        </div>
        <button className="btn" type="submit">شراء سريع</button>
      </form>
      <div className="card text-sm text-slate-600">
        <p>سياسة الاسترجاع: منتجات رقمية رسمية، الاسترجاع فقط بحالة وجود خطأ بالتسليم.</p>
        <p>متابعة الطلب: تم الاستلام → بانتظار الدفع → قيد التجهيز → تم التسليم</p>
      </div>
    </div>
  );
}
