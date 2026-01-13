'use client';

import { useState, useCallback } from 'react';
import { ProductsList } from './ProductsList';
import { ProductFormModal } from './ProductFormModal';
import { ProductStats } from './ProductStats';
import { ProductFilters } from './ProductFilters';
import { useProductStore } from '@/core/store/productStore';

export function SupplierProducts() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const loading = useProductStore(state => state.loading);

  const handleOpenAddModal = useCallback(() => {
    setIsAddingProduct(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddingProduct(false);
    setEditingProduct(null);
  }, []);

  const handleEditProduct = useCallback((product: any) => {
    setEditingProduct(product);
  }, []);

  return (
    <div className="space-y-6">
      <ProductStats
        onAddProduct={handleOpenAddModal}
        loading={loading}
      />

      <ProductFilters />

      {(isAddingProduct || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onCancel={handleCloseModal}
        />
      )}

      <ProductsList
        onEditProduct={handleEditProduct}
      />
    </div>
  );
}