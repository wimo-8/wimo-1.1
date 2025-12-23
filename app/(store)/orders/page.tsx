import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="card space-y-3">
        <p>يرجى تسجيل الدخول برقم هاتفك لمشاهدة طلباتك.</p>
        <Link className="btn" href="/login">
          تسجيل دخول سريع
        </Link>
      </div>
    );
  }
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } }, timeline: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">طلباتي</h1>
      {orders.length === 0 && <div className="card">ماكو طلبات حالياً.</div>}
      {orders.map((order) => (
        <div key={order.id} className="card space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>رقم الطلب: {order.id.slice(0, 8)}</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{order.status}</span>
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.title}</span>
                <span>{item.unitPrice} ألف</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            {order.timeline.map((t) => (
              <p key={t.id}>
                {t.status}: {t.message}
              </p>
            ))}
          </div>
          <Link href={`https://wa.me/9647739543662?text=متابعة طلب ${order.id}`} className="text-primary text-sm">
            تواصل ويانه واتساب
          </Link>
        </div>
      ))}
    </div>
  );
}
