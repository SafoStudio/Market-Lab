'use client';

import { useTranslations } from 'next-intl';

interface EmptyStateProps {
  search: string;
  category: string;
  onClearFilters: () => void;
}

export function EmptyState({ search, category, onClearFilters }: EmptyStateProps) {
  const t = useTranslations();

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('Catalog.noProductsFound')}
      </h3>
      <p className="text-gray-600 mb-6">
        {search || category
          ? t('Catalog.tryChangingSearch')
          : t('Catalog.noProductsInCategory')
        }
      </p>
      {(search || category) && (
        <button
          onClick={onClearFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('Catalog.clearAll')}
        </button>
      )}
    </div>
  );
}