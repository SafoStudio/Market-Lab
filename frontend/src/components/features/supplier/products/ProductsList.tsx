'use client';

import { memo, useMemo } from 'react';
import { ProductCard } from '@/components/product';
import { Product } from '@/core/types/productTypes';
import { useProductStore } from '@/core/store/productStore';
import { useTranslations } from 'next-intl';

import {
  useDeleteSupplierProduct,
  useUpdateSupplierProductStatus
} from '@/core/hooks';

interface ProductsListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  loading?: boolean;
}

export const ProductsList = memo(function ProductsList({
  products,
  onEditProduct,
  loading = false
}: ProductsListProps) {
  const t = useTranslations();

  const {
    searchQuery,
    selectedCategory,
    statusFilter,
    sortBy,
    sortOrder,
  } = useProductStore();

  const deleteProductMutation = useDeleteSupplierProduct();
  const updateStatusMutation = useUpdateSupplierProductStatus();

  // Apply filters and sorting locally
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy, sortOrder]);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm(t('Product.deleteConfirmation'))) return;

    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await updateStatusMutation.mutateAsync({
        id: product.id,
        status: newStatus,
      });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  if (loading && filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => onEditProduct(product)}
            onDelete={() => handleDeleteProduct(product.id)}
            onToggleStatus={() => handleToggleStatus(product)}
            showStatus={true}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4 text-6xl">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('ProductList.emptyTitle')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('ProductList.emptyDescription')}
          </p>
        </div>
      )}

      {loading && filteredProducts.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </>
  );
});