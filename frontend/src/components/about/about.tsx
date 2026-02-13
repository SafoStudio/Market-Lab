'use client'

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-amber-50 to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-r from-green-600 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                🌱
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                  {t('title')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium border border-amber-200">
              🧑‍🌾 {t('badge')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-green-200 to-amber-100 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-amber-100 to-green-100 rounded-full translate-y-48 -translate-x-48 opacity-20"></div>

          <div className="relative z-10 p-8 md:p-12">
            {/* History */}
            <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6 border border-green-200">
                  🌾 {t('story.badge')}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  {t('story.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {t('story.paragraph1')}
                </p>
                <p className="text-lg text-gray-600">
                  {t('story.paragraph2')}
                </p>
              </div>
              <div className="flex-1 relative">
                <div className="relative bg-linear-to-br from-green-50 to-amber-50 rounded-3xl p-8 border-2 border-green-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-3xl mb-2">👨‍🌾</div>
                      <div className="text-2xl font-bold text-green-600">150+</div>
                      <div className="text-sm text-gray-600">{t('stats.farmers')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <div className="text-3xl mb-2">🌽</div>
                      <div className="text-2xl font-bold text-amber-600">500+</div>
                      <div className="text-sm text-gray-600">{t('stats.products')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md col-span-2">
                      <div className="text-3xl mb-2">❤️</div>
                      <div className="text-2xl font-bold text-green-600">1000+</div>
                      <div className="text-sm text-gray-600">{t('stats.customers')}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-30 -z-10"></div>
              </div>
            </div>

            {/* Values of life */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4 border border-amber-200">
                  ⭐ {t('values.badge')}
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {t('values.title')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-4">
                    🥕
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {t('values.0.title')}
                  </h4>
                  <p className="text-gray-600">
                    {t('values.0.desc')}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-3xl mb-4">
                    🤝
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {t('values.1.title')}
                  </h4>
                  <p className="text-gray-600">
                    {t('values.1.desc')}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4">
                    🌍
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {t('values.2.title')}
                  </h4>
                  <p className="text-gray-600">
                    {t('values.2.desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4 border border-green-200">
                  👥 {t('team.badge')}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {t('team.title')}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('team.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                    <div className="w-20 h-20 bg-linear-to-br from-green-100 to-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-white shadow-md">
                      {i === 0 ? '👨‍🌾' : i === 1 ? '👩‍💻' : i === 2 ? '🧑‍🎨' : '👨‍📦'}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {t(`team.members.${i}.name`)}
                    </h4>
                    <p className="text-sm text-green-600 font-medium mb-2">
                      {t(`team.members.${i}.role`)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t(`team.members.${i}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Development of the project */}
            <div className="relative bg-linear-to-r from-green-50 to-amber-50 rounded-3xl p-8 border border-green-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200 rounded-full translate-y-16 -translate-x-16 opacity-20"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-linear-to-r from-green-500 to-amber-500 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">
                    🚀
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {t('future.title')}
                    </h4>
                    <p className="text-gray-600">
                      {t('future.description')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="px-6 py-3 bg-white rounded-xl text-green-700 font-medium border border-green-200 hover:shadow-md transition-all">
                    📋 {t('future.roadmap')}
                  </div>
                  <div className="px-6 py-3 bg-linear-to-r from-green-600 to-amber-600 rounded-xl text-white font-medium hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                    ✉️ {t('future.contact')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}