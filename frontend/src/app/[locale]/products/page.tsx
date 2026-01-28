import { Suspense } from 'react';
import { ProductCatalog } from '@/components/product';
import { Spinner } from '@/components/ui';

export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductCatalog />
    </Suspense>
  );
}