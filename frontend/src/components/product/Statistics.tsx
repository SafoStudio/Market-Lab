'use client';

import { useTranslations } from 'next-intl';

interface StatisticsProps {
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  page: number;
  search: string;
  category: string;
  categories: Array<{ id: string; name: string }>;
}

export function ProductStatistics({
  isLoading,
  totalItems,
  totalPages,
  page,
  search,
  category,
  categories,
}: StatisticsProps) {
  const t = useTranslations();

  const getCategoryName = (categoryId: string): string => {
    const categoryObj = categories.find(c => c.id === categoryId);
    return categoryObj?.name || categoryId;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          {isLoading ? (
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-gray-700">
              {t('Catalog.foundProducts', { count: totalItems })}
              {search && ` ${t('Catalog.forQuery')} "${search}"`}
              {category && ` ${t('Catalog.inCategory')} "${getCategoryName(category)}"`}
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {t('Common.page')} {page} {t('Common.of')} {totalPages}
        </div>
      </div>
    </div>
  );
}