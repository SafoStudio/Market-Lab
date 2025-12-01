interface CardImageProps {
  image: string
  title: string
  isPopular?: boolean
}

export function ProductCardImage({ image, title, isPopular }: CardImageProps) {
  return (
    <div className="relative aspect-4/3 overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      
      {isPopular && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Popular
        </div>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
    </div>
  )
}