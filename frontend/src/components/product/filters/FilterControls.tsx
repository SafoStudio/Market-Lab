'use client';

import { useTranslations } from 'next-intl';

interface FilterControlsProps {
  isAdvancedOpen: boolean;
  hasActiveFilters: boolean;
  onToggleAdvanced: () => void;
  onClearFilters: () => void;
}

export function FilterControls({
  isAdvancedOpen,
  hasActiveFilters,
  onToggleAdvanced,
  onClearFilters,
}: FilterControlsProps) {
  const t = useTranslations();

  return (
    <div className="flex gap-3">
      <button
        onClick={onToggleAdvanced}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span>{isAdvancedOpen ? '▲' : '▼'}</span>
        {isAdvancedOpen
          ? t('Catalog.hideAdvanced')
          : t('Catalog.showAdvanced')
        }
      </button>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2"
        >
          <span>✕</span>
          {t('Catalog.clearAll')}
        </button>
      )}
    </div>
  );
}