import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SooqIQ — سوقIQ',
  description: 'سوق العراقيين للتصميم والتطوير والحلول الرقمية',
  manifest: '/manifest.json',
  icons: [{ rel: 'icon', url: '/icon.svg' }],
  other: {
    'theme-color': '#0f766e',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold text-xl text-primary">
              سوقIQ
            </Link>
            <nav className="flex gap-3 text-sm">
              <Link href="/orders">طلباتي</Link>
              <Link href="/pro">للمحترفين</Link>
              <Link href="/admin">لوحة التحكم</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm leading-6">
          <p>© جميع الحقوق محفوظة — موسى الحيدري</p>
          <p>مصمم ومستخدم للذكاء الصناعي: موسى الحيدري</p>
          <p>
            دعم واتساب: <a href="https://wa.me/9647739543662" className="text-primary">07739543662</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
