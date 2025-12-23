import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="card">وصول محجوب، سجل دخول أولاً.</div>;
  const fullUser = await prisma.user.findUnique({ where: { id: user.id }, include: { roles: true } });
  if (!fullUser || !hasPermission(fullUser.roles, 'manage_catalog')) return <div className="card">ليس لديك صلاحية.</div>;

  const orders = await prisma.order.count();
  const products = await prisma.product.count();
  const pendingSubmissions = await prisma.submission.count({ where: { status: 'PENDING' } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">لوحة التحكم</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">الطلبات</p>
          <p className="text-2xl font-bold">{orders}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">المنتجات</p>
          <p className="text-2xl font-bold">{products}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">عروض قيد المراجعة</p>
          <p className="text-2xl font-bold">{pendingSubmissions}</p>
        </div>
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">اختصارات سريعة</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-lg bg-primary px-3 py-2 text-white" href="/admin/orders">إدارة الطلبات</Link>
          <Link className="rounded-lg bg-primary px-3 py-2 text-white" href="/admin/products">إدارة المنتجات</Link>
          <Link className="rounded-lg bg-primary px-3 py-2 text-white" href="/admin/submissions">مراجعة العروض</Link>
          <Link className="rounded-lg bg-primary px-3 py-2 text-white" href="/admin/settings">إعدادات الدفع</Link>
        </div>
      </div>
    </div>
  );
}
