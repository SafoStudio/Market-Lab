'use client';

import { memo, useMemo } from 'react';
import { Product } from '@/core/types/productTypes';
import { useTranslations } from 'next-intl';

interface ProductStatsProps {
  onAddProduct: () => void;
  loading: boolean;
  products: Product[];
}

export const ProductStats = memo(function ProductStats({
  onAddProduct,
  loading,
  products
}: ProductStatsProps) {
  const t = useTranslations();

  const stats = useMemo(() => {
    let active = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let draft = 0;
    let inactive = 0;
    let archived = 0;

    for (const product of products) {
      switch (product.status) {
        case 'active':
          active++;
          break;
        case 'inactive':
          inactive++;
          break;
        case 'draft':
          draft++;
          break;
        case 'archived':
          archived++;
          break;
      }

      if (product.stock <= 10 && product.stock > 0) lowStock++;
      if (product.stock === 0) outOfStock++;
    }

    return {
      total: products.length,
      active,
      inactive,
      draft,
      archived,
      lowStock,
      outOfStock
    };
  }, [products]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('ProductStats.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('ProductStats.subtitle')}
          </p>
        </div>
        <button
          onClick={onAddProduct}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
        >
          <span>+</span>
          {t('ProductStats.addButton')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">
            {t('Product.totalProducts')}
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">
            {t('Product.status.active')}
          </p>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">
            {t('Product.lowStock')}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.lowStock}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">
            {t('Product.outOfStock')}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.outOfStock}
          </p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 font-medium">
            {t('Product.status.draft')}
          </p>
          <p className="text-lg font-semibold text-gray-800">{stats.draft}</p>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">
            {t('Product.status.inactive')}
          </p>
          <p className="text-lg font-semibold text-gray-800">{stats.inactive}</p>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">
            {t('Product.status.archived')}
          </p>
          <p className="text-lg font-semibold text-gray-800">{stats.archived}</p>
        </div>
      </div>
    </div>
  );
});