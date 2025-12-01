import { ProductItem } from '@/core/mocks/productsData'
import { ProductCardImage } from './ProductCardImage'
import { ProductCardInfo } from './ProductCardInfo'
import { ProductCardActions } from './ProductCardActions'

interface ProductCardProps {
  product: ProductItem
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <ProductCardImage 
        image={product.image} 
        title={product.title}
        isPopular={product.isPopular}
      />
      <div className="p-4">
        <ProductCardInfo product={product} />
        <ProductCardActions product={product} />
      </div>
    </div>
  )
}