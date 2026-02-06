'use client';

import { useState, useEffect } from 'react';


export function ColdStartBanner({ isVisible, countdown }: { isVisible: boolean, countdown: number }) {
  const [language, setLanguage] = useState<'uk' | 'en'>('uk');
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (countdown > 100) setStage(0);
    else if (countdown > 80) setStage(1);
    else if (countdown > 60) setStage(2);
    else if (countdown > 40) setStage(3);
    else if (countdown > 20) setStage(4);
    else setStage(5);
  }, [countdown]);

  if (!isVisible) return null;

  const translations = {
    uk: {
      title: 'Сервер прокидається',
      description: 'На безкоштовному Render.com хостингу серверу потрібно ~30-60 секунд для запуску після періоду бездіяльності.',
      waitingTime: 'Тривалість приготування:',
      tip: '⚡ Миттєва робота після запуску',
      seconds: 'сек',
      stages: [
        '🌱 Посіяв насіння...',
        '💧 Поливаємо...',
        '☀️ Чекаємо сонця...',
        '🌿 Появляються пагони...',
        '🌸 Розквітає...',
        '✅ Готово до збору!'
      ]
    },
    en: {
      title: 'Server is waking up',
      description: 'On free Render.com hosting, the server needs ~30-60 seconds to start after a period of inactivity.',
      waitingTime: 'Preparation duration:',
      tip: '⚡ Instant operation after startup',
      seconds: 'sec',
      stages: [
        '🌱 Sowing seeds...',
        '💧 Watering...',
        '☀️ Waiting for sun...',
        '🌿 Sprouts appearing...',
        '🌸 Blooming...',
        '✅ Ready for harvest!'
      ]
    }
  };

  const t = translations[language];
  const switchLabel = language === 'uk' ? 'EN' : 'UA';

  return (
    <div className="mb-6 p-5 bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl animate-in slide-in-from-top duration-300 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md relative overflow-hidden">

            <div className="absolute bottom-0 left-0 right-0 bg-emerald-300 transition-all duration-1000"
              style={{ height: `${100 - (countdown / 60) * 100}%` }}>
              {countdown > 40 && (
                <>
                  <div className="absolute top-1 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-0 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
            </div>

            <div className="text-xl relative z-10">
              {stage === 0 ? '🌱' :
                stage === 1 ? '🌱' :
                  stage === 2 ? '🌿' :
                    stage === 3 ? '🌿' :
                      stage === 4 ? '🌸' : '✅'}
            </div>
          </div>

          <div className="absolute -inset-2 rounded-full border-2 border-emerald-300/30 animate-ping"></div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-emerald-800 text-lg">
              {t.title}
            </h3>
            <button
              onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
              className="text-xs px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-emerald-300 rounded-lg text-emerald-600 hover:bg-white transition-all hover:shadow-md active:scale-95"
            >
              {switchLabel}
            </button>
          </div>

          <p className="text-emerald-700 text-sm mb-4">
            {t.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${stage === 0 ? 'bg-emerald-300' :
                    stage === 1 ? 'bg-emerald-400' :
                      stage === 2 ? 'bg-green-400' :
                        stage === 3 ? 'bg-green-500' :
                          stage === 4 ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}></div>
                  <span className="text-sm text-emerald-600 font-medium">
                    {t.waitingTime}
                  </span>
                </div>
                <div className="text-xs font-medium text-emerald-700 bg-white/60 px-3 py-1.5 rounded-lg border border-emerald-200">
                  {t.stages[stage]}
                </div>
              </div>

              <div className="font-mono font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 min-w-[70px] text-center shadow-sm">
                {countdown} {t.seconds}
              </div>
            </div>

            {/* stage indicators */}
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= stage
                    ? 'bg-linear-to-r from-emerald-400 to-green-500'
                    : 'bg-emerald-100'
                    } ${s === stage ? 'h-2 animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200">
            <p className="text-xs text-emerald-600 flex items-center gap-2">
              <span className="text-emerald-500 animate-pulse">●</span>
              {t.tip}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}