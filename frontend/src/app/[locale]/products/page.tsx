import { Suspense } from 'react';
import { ProductsCatalog } from '@/components/product/ProductsCatalog';
import { Spinner } from '@/components/ui';

export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductsCatalog />
    </Suspense>
  );
}