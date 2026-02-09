'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { X, Plus, Minus, ShoppingBag, Truck, Shield } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  farmer: string;
  category: string;
  weight: string;
}

export default function Cart() {
  const locale = useLocale();
  const t = useTranslations('Cart');
  const [isVisible, setIsVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Organic Tomatoes',
      price: 4.99,
      quantity: 2,
      image: '🍅',
      farmer: 'Green Valley Farm',
      category: 'Vegetables',
      weight: '1 kg'
    },
    {
      id: '2',
      name: 'Fresh Milk',
      price: 3.49,
      quantity: 1,
      image: '🥛',
      farmer: 'Happy Cows Dairy',
      category: 'Dairy',
      weight: '1 L'
    },
    {
      id: '3',
      name: 'Whole Grain Bread',
      price: 2.99,
      quantity: 3,
      image: '🍞',
      farmer: 'Artisan Bakery',
      category: 'Bakery',
      weight: '500g'
    },
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-amber-50 to-white p-4 md:p-8">
      <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/${locale}`}
                className="flex items-center space-x-3 text-green-700 hover:text-green-800 transition-colors"
              >
                <div className="w-10 h-10 bg-linear-to-r from-green-600 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  ←
                </div>
                <span className="font-medium">{t('continueShopping')}</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">
                {cartItems.length} {t('items')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-linear-to-r from-green-600 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    🛒
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                      {t('yourCart')}
                    </h1>
                    <p className="text-gray-600">{t('cartDescription')}</p>
                  </div>
                </div>

                <div className="px-4 py-2 bg-linear-to-r from-green-100 to-amber-100 rounded-full text-green-800 font-medium border border-green-200">
                  {t('supportFarmers')}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t('freeDeliveryProgress', { amount: 50 - subtotal })}</span>
                  <span className="font-bold text-green-600">
                    ${subtotal.toFixed(2)} / $50
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-green-500 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-linear-to-br from-green-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                        {item.image}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                              {item.category}
                            </span>
                            <span className="text-gray-500 text-sm">{item.weight}</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-gray-600">
                          <span className="text-sm">{t('from')} </span>
                          <span className="font-medium text-green-700">{item.farmer}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 bg-green-50 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors shadow-sm"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors shadow-sm"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-gray-500">
                            ${item.price.toFixed(2)} {t('each')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {cartItems.length === 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-green-100">
                <div className="w-24 h-24 bg-linear-to-r from-green-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                  🛒
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('emptyCartTitle')}</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('emptyCartDescription')}</p>
                <Link
                  href={`/${locale}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-green-600 to-amber-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <ShoppingBag size={20} />
                  <span>{t('startShopping')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Order Summary */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('orderSummary')}</h2>

                {/* Summary Items */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('subtotal')}</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('delivery')}</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('tax')}</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>{t('total')}</span>
                      <span className="bg-linear-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={cartItems.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${cartItems.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-green-600 to-amber-500 text-white hover:shadow-xl hover:-translate-y-0.5'
                    }`}
                >
                  {cartItems.length === 0 ? t('emptyCart') : t('proceedToCheckout')}
                </button>
              </div>

              {/* Benefits Section */}
              <div className="bg-linear-to-br from-green-50 to-amber-50 rounded-3xl shadow-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('benefits.title')}</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{t('benefits.freshDelivery')}</h4>
                      <p className="text-sm text-gray-600">{t('benefits.deliveryDescription')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{t('benefits.qualityGuarantee')}</h4>
                      <p className="text-sm text-gray-600">{t('benefits.qualityDescription')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('promoCode')}</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={t('enterPromoCode')}
                    className="flex-1 px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                    {t('apply')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Support Note */}
        <div className="mt-8 bg-linear-to-r from-green-50 via-amber-50 to-green-50 rounded-3xl shadow-xl p-8 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-r from-green-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                👨‍🌾
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('farmerSupport.title')}</h3>
                <p className="text-gray-600">{t('farmerSupport.description')}</p>
              </div>
            </div>
            <div className="text-green-700 font-bold text-lg">
              ${(subtotal * 0.15).toFixed(2)} {t('farmerSupport.donated')}
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="hidden lg:block">
        <div className="absolute top-1/4 left-8 animate-float">
          <div className="w-8 h-8 bg-green-300 rounded-full opacity-40"></div>
        </div>
        <div className="absolute top-1/3 right-12 animate-float-delayed">
          <div className="w-12 h-12 bg-amber-200 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-1/4 left-20 animate-float-slow">
          <div className="w-6 h-6 bg-green-400 rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}