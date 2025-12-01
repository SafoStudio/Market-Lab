'use client'

import { ProductItem } from '@/core/mocks/productsData'

interface CardActionsProps {
  product: ProductItem
}

export function ProductCardActions({ product }: CardActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold text-green-600">${product.price}</span>
      <button 
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('Add to cart:', product.id)
          //! Тут буде логіка додавання до кошику
        }}
      >
        Add to Cart
      </button>
    </div>
  )
}