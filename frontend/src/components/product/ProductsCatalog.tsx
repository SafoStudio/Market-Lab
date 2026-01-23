'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePublicActiveProducts } from '@/core/hooks';
import { ProductCard } from './ProductCard';
import { useCategories } from '@/core/hooks';
import { useTranslations, useLocale } from 'next-intl';

export function ProductsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { data: categories = [] } = useCategories();

  const { data, isLoading, error } = usePublicActiveProducts({
    page,
    limit,
    category: category || undefined,
    search: debouncedSearch || undefined,
  });

  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      updateUrl({ search: searchInput, page: 1 });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL parameters
  const updateUrl = useCallback((updates: {
    page?: number;
    search?: string;
    category?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.page) params.set('page', updates.page.toString());
    if (updates.search !== undefined) {
      if (updates.search) params.set('search', updates.search);
      else params.delete('search');
    }
    if (updates.category !== undefined) {
      if (updates.category) params.set('category', updates.category);
      else params.delete('category');
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  // Pagination handler
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateUrl({ page: newPage });
  };

  // Category change handler
  const handleCategoryChange = (categoryId: string) => {
    updateUrl({ category: categoryId, page: 1 });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    updateUrl({ search: '', category: '', page: 1 });
  };

  // Search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">
            {t('Common.error')}
          </h2>
          <p className="text-red-700">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t('Common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Common.allProducts')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('Catalog.activeProductsFromAllSuppliers')}
        </p>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('ProductFilters.searchLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder={t('ProductFilters.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Category select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('ProductFilters.categoryLabel')}
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {t('Common.allCategories')}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('ProductFilters.sortLabel')}
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                // Sort functionality can be added later
                console.log('Sort:', e.target.value);
              }}
            >
              <option value="newest">{t('ProductFilters.sortNewest')}</option>
              <option value="price-low">{t('ProductFilters.sortPriceLow')}</option>
              <option value="price-high">{t('ProductFilters.sortPriceHigh')}</option>
            </select>
          </div>
        </div>

        {/* Active filters display */}
        {(search || category) && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {t('ProductFilters.activeFilters')}:
                </span>
                {search && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {t('ProductFilters.searchFilter', { query: search })}
                    <button
                      onClick={() => setSearchInput('')}
                      className="ml-1 hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    {t('ProductFilters.categoryFilter', {
                      category: categories.find(c => c.id === category)?.name || category
                    })}
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="ml-1 hover:text-green-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                {t('ProductFilters.clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-gray-700">
                {t('Catalog.foundProducts', { count: totalItems })}
                {search && ` ${t('Catalog.forQuery')} "${search}"`}
                {category && ` ${t('Catalog.inCategory')} "${categories.find(c => c.id === category)?.name || category}"`}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {t('Common.page')} {page} {t('Common.of')} {totalPages}
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {!isLoading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSupplier={true}
                showStatus={false}
                showActions={false}
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
                compact={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {t('Common.previous')}
                </button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                    let end = Math.min(totalPages, start + maxVisible - 1);

                    // Adjust start if we're near the end
                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    return pages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {t('Common.next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
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
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('ProductFilters.clearAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}