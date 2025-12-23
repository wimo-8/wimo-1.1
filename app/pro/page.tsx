import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProPage() {
  const user = await getCurrentUser();
  const profile = user ? await prisma.sellerProfile.findUnique({ where: { userId: user.id } }) : null;
  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h1 className="text-xl font-bold">بوابة المحترفين</h1>
        <p className="text-sm text-slate-600">اعرض خدماتك الرقمية، وسنراجعها وننشرها للعملاء.</p>
        {!profile && (
          <Link href="/pro/onboard" className="btn">
            قدّم طلب احترافي
          </Link>
        )}
        {profile && (
          <p className="text-sm">حالتك الحالية: {profile.status}</p>
        )}
      </div>
      {profile && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="card">
            <h2 className="font-semibold">خدماتي</h2>
            <Link href="/pro/services" className="text-primary text-sm">إدارة الخدمات</Link>
          </div>
          <div className="card">
            <h2 className="font-semibold">أعمالي</h2>
            <Link href="/pro/portfolio" className="text-primary text-sm">تحديث البورتفوليو</Link>
          </div>
        </div>
      )}
    </div>
  );
}
