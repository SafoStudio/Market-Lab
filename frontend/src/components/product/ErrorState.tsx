'use client';

import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-3xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-800 mb-2">
          {t('Common.error')}
        </h2>
        <p className="text-red-700">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {t('Common.tryAgain')}
        </button>
      </div>
    </div>
  );
}