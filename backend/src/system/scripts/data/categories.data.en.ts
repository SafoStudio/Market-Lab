export const mainCategoriesData = [
  {
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Fresh farm vegetables from natural farming',
    order: 1,
    metaTitle: 'Farm Vegetables',
    metaDescription: 'Natural vegetables without chemical fertilizers and pesticides'
  },
  {
    name: 'Fruits',
    slug: 'fruits',
    description: 'Seasonal fruits from own gardens',
    order: 2,
    metaTitle: 'Seasonal Fruits',
    metaDescription: 'Sun-ripened fruits from ecologically clean regions'
  },
  {
    name: 'Dairy Products',
    slug: 'dairy-products',
    description: 'Natural dairy products without preservatives',
    order: 3,
    metaTitle: 'Homemade Dairy Products',
    metaDescription: 'Milk, cheese, sour cream and other handmade dairy products'
  },
  {
    name: 'Meat and Poultry',
    slug: 'meat-poultry',
    description: 'Fresh farm meat and poultry',
    order: 4,
    metaTitle: 'Farm Meat',
    metaDescription: 'Natural meat fed on natural feed'
  },
  {
    name: 'Eggs',
    slug: 'eggs',
    description: 'Village eggs from free-range chickens',
    order: 5,
    metaTitle: 'Village Eggs',
    metaDescription: 'Eggs from chickens living free-range'
  },
  {
    name: 'Bread and Bakery',
    slug: 'bread-bakery',
    description: 'Homemade bread on natural sourdough',
    order: 6,
    metaTitle: 'Homemade Bakery',
    metaDescription: 'Bread, buns, pies handmade'
  },
  {
    name: 'Honey and Bee Products',
    slug: 'honey-bee-products',
    description: 'Natural honey from own apiaries',
    order: 7,
    metaTitle: 'Natural Honey',
    metaDescription: 'Honey, propolis, pollen from ecologically clean regions'
  },
  {
    name: 'Preserves',
    slug: 'preserves',
    description: 'Homemade preserves from seasonal vegetables and fruits',
    order: 8,
    metaTitle: 'Homemade Preserves',
    metaDescription: 'Jam, pickles, marinades handmade'
  },
  {
    name: 'Drinks',
    slug: 'drinks',
    description: 'Natural drinks without preservatives',
    order: 9,
    metaTitle: 'Homemade Drinks',
    metaDescription: 'Juices, fruit drinks, kvass, herbal teas'
  },
  {
    name: 'Grains and Cereals',
    slug: 'grains-cereals',
    description: 'Natural cereals without artificial processing',
    order: 10,
    metaTitle: 'Natural Cereals',
    metaDescription: 'Buckwheat, rice, oatmeal, millet from own fields'
  },
  {
    name: 'Nuts and Dried Fruits',
    slug: 'nuts-dried-fruits',
    description: 'Natural nuts and dried fruits',
    order: 11,
    metaTitle: 'Nuts and Dried Fruits',
    metaDescription: 'Nut kernels and dried fruits without sugar'
  },
  {
    name: 'Vegetable Oils',
    slug: 'vegetable-oils',
    description: 'Cold-pressed oils',
    order: 12,
    metaTitle: 'Natural Oils',
    metaDescription: 'Sunflower, flax, pumpkin oils cold pressed'
  },
  {
    name: 'Spices and Herbs',
    slug: 'spices-herbs',
    description: 'Natural spices and medicinal herbs',
    order: 13,
    metaTitle: 'Spices and Herbs',
    metaDescription: 'Dried herbs, spices, tea blends'
  },
  {
    name: 'Farm Delicacies',
    slug: 'farm-delicacies',
    description: 'Homemade sausages, cheeses and pates',
    order: 14,
    metaTitle: 'Farm Delicacies',
    metaDescription: 'Sausages, cheeses, pates handmade'
  },
  {
    name: 'Baby Food',
    slug: 'baby-food',
    description: 'Natural food for children',
    order: 15,
    metaTitle: 'Baby Food',
    metaDescription: 'Purees, porridge, snacks for children'
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'Other farm products',
    order: 16,
    metaTitle: 'Other Products',
    metaDescription: 'Various farm products'
  }
];

export const subcategoriesData = {
  // Subcategories for Vegetables
  'vegetables': [
    { name: 'Root Vegetables', slug: 'root-vegetables', order: 1 },
    { name: 'Leafy Vegetables', slug: 'leafy-vegetables', order: 2 },
    { name: 'Nightshades', slug: 'nightshades', order: 3 },
    { name: 'Cruciferous', slug: 'cruciferous', order: 4 },
    { name: 'Cucurbits', slug: 'cucurbits', order: 5 },
    { name: 'Alliums', slug: 'alliums', order: 6 },
  ],

  // Subcategories for Fruits
  'fruits': [
    { name: 'Berries', slug: 'berries', order: 1 },
    { name: 'Citrus Fruits', slug: 'citrus-fruits', order: 2 },
    { name: 'Stone Fruits', slug: 'stone-fruits', order: 3 },
    { name: 'Tropical Fruits', slug: 'tropical-fruits', order: 4 },
    { name: 'Melons', slug: 'melons', order: 5 },
    { name: 'Pome Fruits', slug: 'pome-fruits', order: 6 },
  ],

  // Subcategories for Dairy Products
  'dairy-products': [
    { name: 'Milk', slug: 'milk', order: 1 },
    { name: 'Cheese', slug: 'cheese', order: 2 },
    { name: 'Yogurt', slug: 'yogurt', order: 3 },
    { name: 'Butter', slug: 'butter', order: 4 },
    { name: 'Cream', slug: 'cream', order: 5 },
    { name: 'Fermented Dairy', slug: 'fermented-dairy', order: 6 },
  ],

  // Subcategories for Meat and Poultry
  'meat-poultry': [
    { name: 'Pork', slug: 'pork', order: 1 },
    { name: 'Beef', slug: 'beef', order: 2 },
    { name: 'Chicken', slug: 'chicken', order: 3 },
    { name: 'Turkey', slug: 'turkey', order: 4 },
    { name: 'Rabbit', slug: 'rabbit', order: 5 },
    { name: 'Offal', slug: 'offal', order: 6 },
  ],

  // Subcategories for Bread and Bakery
  'bread-bakery': [
    { name: 'Bread', slug: 'bread', order: 1 },
    { name: 'Buns', slug: 'buns', order: 2 },
    { name: 'Pies', slug: 'pies', order: 3 },
    { name: 'Cookies', slug: 'cookies', order: 4 },
    { name: 'Cakes', slug: 'cakes', order: 5 },
    { name: 'Croissants', slug: 'croissants', order: 6 },
  ],

  // Subcategories for Honey and Bee Products
  'honey-bee-products': [
    { name: 'Honey', slug: 'honey', order: 1 },
    { name: 'Propolis', slug: 'propolis', order: 2 },
    { name: 'Bee Pollen', slug: 'bee-pollen', order: 3 },
    { name: 'Royal Jelly', slug: 'royal-jelly', order: 4 },
    { name: 'Beeswax', slug: 'beeswax', order: 5 },
    { name: 'Bee Bread', slug: 'bee-bread', order: 6 },
  ],

  // Subcategories for Preserves
  'preserves': [
    { name: 'Jams and Marmalades', slug: 'jams-marmalades', order: 1 },
    { name: 'Pickles', slug: 'pickles', order: 2 },
    { name: 'Marinades', slug: 'marinades', order: 3 },
    { name: 'Compotes', slug: 'compotes', order: 4 },
    { name: 'Sauces', slug: 'sauces', order: 5 },
    { name: 'Preserved Juices', slug: 'preserved-juices', order: 6 },
  ],

  // Subcategories for Drinks
  'drinks': [
    { name: 'Fresh Juices', slug: 'fresh-juices', order: 1 },
    { name: 'Fruit Drinks', slug: 'fruit-drinks', order: 2 },
    { name: 'Kvass', slug: 'kvass', order: 3 },
    { name: 'Herbal Teas', slug: 'herbal-teas', order: 4 },
    { name: 'Kombucha', slug: 'kombucha', order: 5 },
    { name: 'Lemonades', slug: 'lemonades', order: 6 },
  ],

  // Subcategories for Grains and Cereals
  'grains-cereals': [
    { name: 'Buckwheat', slug: 'buckwheat', order: 1 },
    { name: 'Rice', slug: 'rice', order: 2 },
    { name: 'Oatmeal', slug: 'oatmeal', order: 3 },
    { name: 'Millet', slug: 'millet', order: 4 },
    { name: 'Barley', slug: 'barley', order: 5 },
    { name: 'Wheat', slug: 'wheat', order: 6 },
  ],

  // Subcategories for Nuts and Dried Fruits
  'nuts-dried-fruits': [
    { name: 'Walnuts', slug: 'walnuts', order: 1 },
    { name: 'Hazelnuts', slug: 'hazelnuts', order: 2 },
    { name: 'Almonds', slug: 'almonds', order: 3 },
    { name: 'Peanuts', slug: 'peanuts', order: 4 },
    { name: 'Dried Apricots', slug: 'dried-apricots', order: 5 },
    { name: 'Raisins', slug: 'raisins', order: 6 },
  ],

  // Subcategories for Vegetable Oils
  'vegetable-oils': [
    { name: 'Sunflower Oil', slug: 'sunflower-oil', order: 1 },
    { name: 'Flaxseed Oil', slug: 'flaxseed-oil', order: 2 },
    { name: 'Pumpkin Seed Oil', slug: 'pumpkin-seed-oil', order: 3 },
    { name: 'Olive Oil', slug: 'olive-oil', order: 4 },
    { name: 'Sesame Oil', slug: 'sesame-oil', order: 5 },
    { name: 'Corn Oil', slug: 'corn-oil', order: 6 },
  ],

  // Subcategories for Spices and Herbs
  'spices-herbs': [
    { name: 'Dried Herbs', slug: 'dried-herbs', order: 1 },
    { name: 'Spices', slug: 'spices', order: 2 },
    { name: 'Tea Blends', slug: 'tea-blends', order: 3 },
    { name: 'Medicinal Herbs', slug: 'medicinal-herbs', order: 4 },
    { name: 'Seasoning Mixes', slug: 'seasoning-mixes', order: 5 },
    { name: 'Salt and Pepper', slug: 'salt-pepper', order: 6 },
  ],

  // Subcategories for Farm Delicacies
  'farm-delicacies': [
    { name: 'Sausages', slug: 'sausages', order: 1 },
    { name: 'Cheeses', slug: 'cheeses', order: 2 },
    { name: 'Pates', slug: 'pates', order: 3 },
    { name: 'Smoked Meats', slug: 'smoked-meats', order: 4 },
    { name: 'Cured Meats', slug: 'cured-meats', order: 5 },
    { name: 'Pickled Products', slug: 'pickled-products', order: 6 },
  ],

  // Subcategories for Baby Food
  'baby-food': [
    { name: 'Purees', slug: 'purees', order: 1 },
    { name: 'Porridge', slug: 'porridge', order: 2 },
    { name: 'Snacks', slug: 'snacks', order: 3 },
    { name: 'Tea for Babies', slug: 'tea-for-babies', order: 4 },
    { name: 'Juices for Babies', slug: 'juices-for-babies', order: 5 },
    { name: 'Cookies for Babies', slug: 'cookies-for-babies', order: 6 },
  ]
};