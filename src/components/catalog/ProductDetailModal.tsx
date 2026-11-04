import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, formatInstallment } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  currentCity: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  currentCity,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `${product.title} за ${formatPrice(product.price)} в ElectroNova`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const mockReviews = [
    {
      author: 'Алихан Б.',
      city: 'Алматы',
      rating: 5,
      date: 'Вчера',
      text: 'Отличный гаджет! Доставили день в день в Алматы, упаковка заводская, пломбы на месте. Оформил через Kaspi Рассрочку — быстро и без лишней волокиты.',
    },
    {
      author: 'Мадина С.',
      city: 'Астана',
      rating: 5,
      date: '3 дня назад',
      text: 'Оригинал 100%. Работает идеально, камера и производительность на высшем уровне. Спасибо ElectroNova за отличный сервис!',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow-lg cursor-pointer"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-2xl bg-slate-950 p-6 flex items-center justify-center border border-slate-800/80 overflow-hidden">
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-500 text-white shadow-lg">
                    {product.badge}
                  </span>
                )}
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl bg-slate-950 p-1 border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-cyan-500 scale-105 shadow-md shadow-cyan-500/30'
                          : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantee and Delivery assurances */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <p className="text-[11px] font-medium text-slate-300">Гарантия 1 год</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[11px] font-medium text-slate-300">В {currentCity}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <RotateCcw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-[11px] font-medium text-slate-300">14 дней обмен</p>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Brand & Stock */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-cyan-400 tracking-wider uppercase">
                    {product.brand}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      product.inStock
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {product.inStock ? `В наличии (${product.stockCount} шт)` : 'Под заказ'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {product.title}
                </h1>

                {/* Rating & Share */}
                <div className="flex items-center justify-between mt-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-white ml-1">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} отзывов)</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Ссылка скопирована!' : 'Поделиться'}</span>
                  </button>
                </div>

                {/* Price block */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm sm:text-base text-slate-500 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    {product.oldPrice && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        Экономия {formatPrice(product.oldPrice - product.price)}
                      </span>
                    )}
                  </div>

                  {/* Kaspi Installment Interactive Calculator */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-red-400" /> Kaspi Рассрочка 0-0-12
                      </span>
                      <span className="text-sm font-black text-white">
                        {formatInstallment(product.price, selectedMonths)}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 6, 12, 24].map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedMonths(m)}
                          className={`py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            selectedMonths === m
                              ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {m} мес
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: Quantity & Add to Cart */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      addedSuccess
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 active:scale-[0.98]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Добавлено в корзину!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isInCart ? 'Добавить ещё' : 'В корзину'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleFavorite(product)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isFavorite ? 'В избранном' : 'Добавить в избранное'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications & Description */}
          <div className="pt-6 border-t border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Описание товара</h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                {product.description}
              </p>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3">Технические характеристики</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs)
                    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/70"
                      >
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-semibold text-slate-200 text-right">{val}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">
                Отзывы покупателей в Казахстане ({product.reviewsCount})
              </h3>
              <div className="space-y-3">
                {mockReviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rev.author}</span>
                        <span className="text-slate-500">• {rev.city}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          Проверенный покупатель
                        </span>
                      </div>
                      <span className="text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
