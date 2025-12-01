import { ProductItem } from '@/core/mocks/productsData'

interface ProductDetailsProps {
  product: ProductItem
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-auto rounded-2xl object-cover shadow-lg"
        />
        {product.organic && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            🌿 Organic
          </div>
        )}
        {product.isPopular && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            🏆 Popular
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

        {/* Price and Rating */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-3xl font-bold text-green-600">
            {product.price}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-xl">⭐</span>
            <div>
              <div className="font-medium">{product.rating}/5</div>
              <div className="text-sm text-gray-500">{product.reviewsCount} reviews</div>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="bg-green-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            👨‍🌾 Farmer Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Farm:</span>
              <span className="font-medium">{product.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-medium">{product.farmerLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Origin:</span>
              <span className="font-medium">{product.origin}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{product.weight} {product.unit}</span>
            </div>
            {product.harvestDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Harvest Date:</span>
                <span className="font-medium">{product.harvestDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Standard:</span>
              <span className="font-medium">{product.organic ? 'Organic' : 'Conventional'}</span>
            </div>
          </div>
        </div>

        {/* Nutritional Value */}
        {product.nutrients && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Nutritional Value</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.nutrients.calories && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{product.nutrients.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
              )}
              {product.nutrients.protein && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{product.nutrients.protein}</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
              )}
              {product.nutrients.carbs && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{product.nutrients.carbs}</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
              )}
              {product.nutrients.fat && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{product.nutrients.fat}</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Characteristics</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            🛒 Add to Cart
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
            💖 Save
          </button>
        </div>
      </div>
    </div>
  )
}