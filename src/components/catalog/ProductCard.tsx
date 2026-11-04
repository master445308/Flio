import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check, Zap, Eye } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, formatInstallment } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  onOpenDetails,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product);
  };

  // Badge styles
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Хит':
        return 'bg-amber-500/90 text-white shadow-amber-500/20';
      case 'Новинка':
        return 'bg-cyan-500/90 text-white shadow-cyan-500/20';
      case 'Скидка':
        return 'bg-rose-500/90 text-white shadow-rose-500/20';
      default:
        return 'bg-blue-600/90 text-white';
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden cursor-pointer select-none"
    >
      {/* Top Media Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950 p-4 flex items-center justify-center">
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md ${getBadgeStyle(
              product.badge
            )}`}
          >
            {product.badge}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Overlay icon on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-xs font-semibold text-white border border-slate-700 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Быстрый просмотр
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
            <span className={product.inStock ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
              {product.inStock ? `В наличии: ${product.stockCount} шт` : 'Под заказ'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 line-clamp-2 transition-colors mb-2">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-slate-200">{product.rating}</span>
            </div>
            <span>•</span>
            <span>{product.reviewsCount} отзывов</span>
          </div>
        </div>

        {/* Pricing & Installment & CTA */}
        <div className="pt-2 border-t border-slate-800/80">
          {/* Kaspi Installment Badge */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md mb-2 w-fit">
            <Zap className="w-3 h-3 text-red-400 fill-red-400" />
            <span>Kaspi 0-0-12: {formatInstallment(product.price, 12)}</span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-white">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow cursor-pointer ${
                justAdded
                  ? 'bg-emerald-500 text-white scale-105'
                  : isInCart
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-95'
              }`}
              title="Добавить в корзину"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span className="hidden sm:inline">Добавлено</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">{isInCart ? '+1 шт' : 'В корзину'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
