import { ProductItem } from '@/core/mocks/productsData'

interface ProductCardInfoProps {
  product: ProductItem
}

export function ProductCardInfo({ product }: ProductCardInfoProps) {
  return (
    <div className="mb-4">
      {/* Category and organic icon */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>
        {product.organic && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            🌿 Organic
          </span>
        )}
      </div>

      {/* Product name */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-green-600 transition-colors">
        {product.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

      {/* Information about the farmer */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">👨‍🌾</span>
          <span className="text-gray-700 font-medium">{product.farmerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 ml-6">
          <span>📍 {product.farmerLocation}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <span>⚖️</span>
          <span>{product.weight} {product.unit}</span>
        </span>
        {product.harvestDate && (
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{product.harvestDate}</span>
          </span>
        )}
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-500">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}