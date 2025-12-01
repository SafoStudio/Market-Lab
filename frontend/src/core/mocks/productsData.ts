// core/mocks/productsData.ts
export interface ProductItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  farmerName: string
  farmerLocation: string
  origin: string
  weight: string
  unit: string
  harvestDate?: string
  organic: boolean
  rating: number
  reviewsCount: number
  price: string
  tags: string[]
  isPopular?: boolean
  nutrients?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
  }
}

const DEFAULT_IMAGE = '/noimage.png'

export const products: ProductItem[] = [
  {
    id: '1',
    title: 'Помідори Черрі Біо',
    description: 'Солодкі екологично чисті помідори черрі, вирощені без пестицидів. Збір вручну.',
    image: DEFAULT_IMAGE,
    category: 'Овочі',
    farmerName: 'Ферма "Сонячний Сад"',
    farmerLocation: 'Черкаська область',
    origin: 'Локальне виробництво',
    weight: '500',
    unit: 'г',
    harvestDate: 'Вересень 2024',
    organic: true,
    rating: 4.9,
    reviewsCount: 156,
    price: '89 ₴',
    tags: ['Еко', 'Органічне', 'Без пестицидів', 'Сезонне'],
    isPopular: true,
    nutrients: {
      calories: '18 ккал',
      protein: '0.9 г',
      carbs: '3.9 г',
      fat: '0.2 г'
    }
  },
  {
    id: '2',
    title: 'Мед акацієвий',
    description: 'Натуральний мед з акації, зібраний у Карпатському регіоні. Не пастеризований.',
    image: DEFAULT_IMAGE,
    category: 'Мед',
    farmerName: 'Пасека "Карпатський Бджоляр"',
    farmerLocation: 'Івано-Франківська область',
    origin: 'Карпати',
    weight: '500',
    unit: 'г',
    organic: true,
    rating: 4.8,
    reviewsCount: 203,
    price: '249 ₴',
    tags: ['Натуральний', 'Лікувальний', 'Без додатків'],
    nutrients: {
      calories: '304 ккал',
      protein: '0.3 г',
      carbs: '82 г',
      fat: '0 г'
    }
  },
  {
    id: '3',
    title: 'Яйця курки вільного вигулу',
    description: 'Яйця від курей, що живуть на вільному вигулі та живляться натуральними кормами.',
    image: DEFAULT_IMAGE,
    category: 'Яйця',
    farmerName: 'Ферма "Щаслива Курка"',
    farmerLocation: 'Вінницька область',
    origin: 'Локальне виробництво',
    weight: '10',
    unit: 'шт',
    organic: true,
    rating: 4.7,
    reviewsCount: 189,
    price: '139 ₴',
    tags: ['Вільний вигул', 'Без антибіотиків', 'Натуральний корм'],
    isPopular: true
  },
  {
    id: '4',
    title: 'Сир козячий',
    description: 'Ніжний козячий сир з травами, виготовлений за традиційними рецептами.',
    image: DEFAULT_IMAGE,
    category: 'Молочні продукти',
    farmerName: 'Сирня "Козяча Родина"',
    farmerLocation: 'Львівська область',
    origin: 'Локальне виробництво',
    weight: '250',
    unit: 'г',
    organic: true,
    rating: 4.6,
    reviewsCount: 97,
    price: '189 ₴',
    tags: ['Козяче молоко', 'Без консервантів', 'Ручна робота']
  },
  {
    id: '5',
    title: 'Яблука Голден',
    description: 'Соковиті солодкі яблука сорту Голден, вирощені в екологічно чистому регіоні.',
    image: DEFAULT_IMAGE,
    category: 'Фрукти',
    farmerName: 'Сад "Яблучна Долина"',
    farmerLocation: 'Закарпатська область',
    origin: 'Локальне виробництво',
    weight: '1',
    unit: 'кг',
    harvestDate: 'Жовтень 2024',
    organic: true,
    rating: 4.5,
    reviewsCount: 134,
    price: '69 ₴',
    tags: ['Сезонне', 'Еко', 'Без хімії']
  },
  {
    id: '6',
    title: 'Цільнозерновий хліб',
    description: 'Хліб з борошна цільного помелу на натуральній заквасці без дріжджів.',
    image: DEFAULT_IMAGE,
    category: 'Хліб',
    farmerName: 'Пекарня "Здорове Зерно"',
    farmerLocation: 'Київська область',
    origin: 'Локальне виробництво',
    weight: '500',
    unit: 'г',
    organic: true,
    rating: 4.8,
    reviewsCount: 178,
    price: '79 ₴',
    tags: ['Цільнозерновий', 'Без дріжджів', 'Натуральна закваска']
  }
]