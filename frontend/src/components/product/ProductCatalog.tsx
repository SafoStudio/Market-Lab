'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePublicActiveProducts } from '@/core/hooks';
import { useCategories } from '@/core/hooks';
import { useTranslations, useLocale } from 'next-intl';
import { CatalogHeader } from './CatalogHeader';
import { ProductFilters } from './filters/ProductFilters';
import { ProductStatistics } from './Statistics';
import { ActiveFilters } from './filters/ActiveFilters';
import { ProductList } from './ProductList';
import { Pagination } from '../ui/Pagination';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';


export function ProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();

  // params from URL
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  // local state
  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const { data: categories = [] } = useCategories();

  const { data, isLoading, error } = usePublicActiveProducts({
    page,
    limit,
    category: category || undefined,
    search: debouncedSearch || undefined,
    // sort params
  });

  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      updateUrl({ search: searchInput, page: 1 });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Обновление URL параметров
  const updateUrl = useCallback((updates: {
    page?: number;
    search?: string;
    category?: string;
    sort?: string;
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
    if (updates.sort !== undefined) {
      if (updates.sort) params.set('sort', updates.sort);
      else params.delete('sort');
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  // filter statistics
  const stats = useMemo(() => {
    const total = totalItems;
    const inStock = products.filter(p => p.stock > 0).length;
    const lowStock = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return { total, inStock, lowStock, outOfStock };
  }, [products, totalItems]);

  // handlers
  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateUrl({ page: newPage });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateUrl({ category: categoryId, page: 1 });
  };

  const handleSortChange = (sortValue: string) => {
    updateUrl({ sort: sortValue, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    updateUrl({ search: '', category: '', sort: '', page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleToggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  const allCategoriesList = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      slug: category.slug,
    })).sort((a, b) => a.slug.localeCompare(b.slug));
  }, [categories]);

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CatalogHeader
        title={t('Common.allProducts')}
        description={t('Catalog.activeProductsFromAllSuppliers')}
      />

      <ProductFilters
        stats={stats}
        searchInput={searchInput}
        category={category}
        sort={sort}
        categories={allCategoriesList}
        allCategories={categories}
        isAdvancedOpen={isAdvancedOpen}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onToggleAdvanced={handleToggleAdvanced}
        onClearFilters={handleClearFilters}
      />

      <ActiveFilters
        search={search}
        category={category}
        categories={categories}
        sort={sort}
        onClearSearch={() => handleSearchChange('')}
        onClearCategory={() => handleCategoryChange('')}
        onClearSort={() => handleSortChange('')}
        onClearAll={handleClearFilters}
      />

      <ProductStatistics
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        page={page}
        search={search}
        category={category}
        categories={categories}
      />

      {products.length === 0 && !isLoading ? (
        <EmptyState
          search={search}
          category={category}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          <ProductList
            products={products}
            isLoading={isLoading}
            limit={limit}
            locale={locale}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}