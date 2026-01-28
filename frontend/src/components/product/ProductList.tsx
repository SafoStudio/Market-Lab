'use client';

import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Product } from '@/core/types/productTypes';
import { Spinner } from '../ui';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  limit: number;
  locale: string;
}

export function ProductList({ products, isLoading, limit, locale }: ProductListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Spinner key={i} />
        ))}
      </div>
    );
  }

  return (
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
  );
}