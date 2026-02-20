'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export function DesktopNav() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const locale = useLocale();

  const navItems = [
    { key: 'products', path: 'products', label: t('products') },
    { key: 'sellers', path: 'sellers', label: t('sellers') },
    { key: 'map', path: 'map', label: t('map') },
    { key: 'about', path: 'about', label: t('about') },
  ];

  const isActive = (path: string) => {
    const fullPath = `/${locale}/${path}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={`${item.key}-${locale}`}
          href={`/${locale}/${item.path}`}
          className={`px-2 py-[5px] border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'text-gray-700 hover:bg-green-200 hover:text-gray-900'
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}