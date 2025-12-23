import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    take: 12,
  });
  const categories = await prisma.category.findMany({ take: 6 });

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 bg-gradient-to-br from-primary to-emerald-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">سوقIQ — سوق العراقيين للتصميم والتطوير</p>
            <h1 className="text-2xl font-bold">هلا بيك 👋 خلّص طلبك خلال دقيقة</h1>
            <p className="text-sm text-white/80">منتجات مرخصة، خدمات احترافية، وتسليم سريع بدون دوخة</p>
          </div>
          <SparklesIcon className="h-10 w-10" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/search?category=${cat.id}`} className="rounded-xl bg-white/15 px-3 py-2">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">عروض مميزة</h2>
          <Link href="/search" className="text-primary text-sm">كل المنتجات</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div key={product.id} className="card flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{product.category?.name}</p>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-slate-600">{product.description}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ShoppingBagIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-primary">{product.price} ألف</span>
                <Link href={`/product/${product.id}`} className="rounded-full bg-primary px-4 py-2 text-white">اشتري الآن</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
