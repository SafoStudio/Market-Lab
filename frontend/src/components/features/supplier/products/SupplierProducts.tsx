'use client';

import { useState, useCallback } from 'react';
import { ProductsList } from './ProductsList';
import { ProductFormModal } from './ProductFormModal';
import { ProductStats } from './ProductStats';
import { ProductFilters } from './ProductFilters';
import { useProductStore } from '@/core/store/productStore';
import { useSupplierProducts } from '@/core/hooks';
import { Product } from '@/core/types/productTypes';

export function SupplierProducts() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading: productsLoading } = useSupplierProducts();

  const { loading: uiLoading } = useProductStore();

  const loading = productsLoading || uiLoading;

  const handleOpenAddModal = useCallback(() => {
    setIsAddingProduct(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddingProduct(false);
    setEditingProduct(null);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  return (
    <div className="space-y-6">
      <ProductStats
        onAddProduct={handleOpenAddModal}
        loading={loading}
        products={products}
      />

      <ProductFilters products={products} />

      {(isAddingProduct || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onCancel={handleCloseModal}
        />
      )}

      <ProductsList
        onEditProduct={handleEditProduct}
        products={products}
        loading={loading}
      />
    </div>
  );
}