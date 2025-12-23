import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const { q, category } = searchParams;
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      title: q ? { contains: q, mode: 'insensitive' } : undefined,
      categoryId: category || undefined,
    },
    include: { category: true },
  });
  const categories = await prisma.category.findMany();
  return (
    <div className="space-y-4">
      <form className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="q" placeholder="بحث سريع" className="rounded-lg border px-3 py-2" defaultValue={q} />
        <select name="category" className="rounded-lg border px-3 py-2" defaultValue={category}>
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn sm:col-span-2" type="submit">
          بحث
        </button>
      </form>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="card">
            <p className="text-xs text-slate-500">{p.category?.name}</p>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.description}</p>
          </div>
        ))}
        {products.length === 0 && <div className="card">ما وجدنا نتائج.</div>}
      </div>
    </div>
  );
}
