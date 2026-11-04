import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, CreditCard, ShieldCheck, Zap } from 'lucide-react';

interface HeroBannerProps {
  onGoToCatalog: (category?: string) => void;
  onApplyPromo: (code: string) => void;
  currentCity: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onGoToCatalog,
  onApplyPromo,
  currentCity,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: '🔥 Главная акция года',
      title: 'Рассрочка Kaspi 0-0-12',
      highlight: 'без переплат и первого взноса',
      desc: `Забирайте новинки Apple iPhone 16 Pro, Samsung Galaxy S25 и Sony с ежемесячным платежом от 12 500 ₸/мес с доставкой в ${currentCity}.`,
      cta: 'Смотреть новинки',
      action: () => onGoToCatalog('smartphones'),
      bgGradient: 'from-blue-900/60 via-slate-900/80 to-slate-950',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CreditCard,
    },
    {
      id: 2,
      tag: '🎁 Эксклюзивный промокод',
      title: 'Скидка 15% на весь заказ',
      highlight: 'по промокоду MONIS05',
      desc: 'Активируйте в корзине специальный промокод MONIS05 и экономьте до 150 000 ₸ при покупке топовой техники.',
      cta: 'Активировать промокод',
      action: () => {
        onApplyPromo('MONIS05');
        onGoToCatalog();
      },
      bgGradient: 'from-purple-900/60 via-slate-900/80 to-slate-950',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: Sparkles,
    },
    {
      id: 3,
      tag: '⚡ Экспресс-доставка',
      title: `Доставка за 2 часа в ${currentCity}`,
      highlight: 'или в Kaspi Postomat у дома',
      desc: 'Оригинальная сертифицированная техника с официальной гарантией 1 год. Оплата при получении или Kaspi QR.',
      cta: 'Открыть весь каталог',
      action: () => onGoToCatalog('all'),
      bgGradient: 'from-cyan-900/60 via-slate-900/80 to-slate-950',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: Zap,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950 my-4 sm:my-6 shadow-2xl">
      {/* Background glow and decor */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-colors duration-700`} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content */}
      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12 max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${slide.badgeColor}`}>
            <Icon className="w-3.5 h-3.5" />
            {slide.tag}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/40">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> Официальная гарантия
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {slide.title} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            {slide.highlight}
          </span>
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          {slide.desc}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={slide.action}
            className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition cursor-pointer"
          >
            {slide.cta}
          </button>
          <button
            onClick={() => onGoToCatalog('all')}
            className="px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Все категории
          </button>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 px-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
