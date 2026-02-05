'use client';

import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Product } from '@/core/types/productTypes';
import { useColdStart } from '@/core/hooks/useColdStart';
import { Spinner, ColdStartBanner } from '@/components/ui';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  limit: number;
  locale: string;
}

export function ProductList({ products, isLoading, limit, locale }: ProductListProps) {
  const router = useRouter();
  const { showBanner, countdown } = useColdStart(isLoading, 5000);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ColdStartBanner isVisible={showBanner} countdown={countdown} />
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
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