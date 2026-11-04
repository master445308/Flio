import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Zap,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CartItem, PromoCode } from '../../types';
import { formatPrice, formatInstallment } from '../../utils/formatters';

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onOpenCheckout: () => void;
  onContinueShopping: () => void;
  currentCity: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onOpenCheckout,
  onContinueShopping,
  currentCity,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const freeShippingThreshold = 30000; // 30,000 ₸
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 2500;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const ok = onApplyPromo(promoInput.trim());
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Неверный промокод. Попробуйте MONIS05, ELECTRO10 или KASPI5');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Корзина пуста</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Выберите новинки электроники с ценами в тенге и возможностью рассрочки Kaspi 0-0-12
        </p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          Перейти к покупкам
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Корзина покупок</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {items.reduce((sum, item) => sum + item.quantity, 0)} товаров на сумму {formatPrice(subtotal)}
          </p>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Очистить</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Items list */}
        <div className="lg:col-span-7 space-y-4">
          {/* Free Shipping Progress */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                {shippingFee === 0 ? 'Бесплатная доставка активна!' : `До бесплатной доставки в ${currentCity}:`}
              </span>
              <span className="font-bold text-cyan-400">
                {shippingFee === 0 ? '0 ₸' : formatPrice(freeShippingThreshold - subtotal)}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 p-1.5 shrink-0 flex items-center justify-center border border-slate-800">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {item.product.brand}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {item.product.title}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-slate-400">
                        ({formatPrice(item.product.price)} / шт)
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                      aria-label="Уменьшить"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                      aria-label="Увеличить"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary & Promo Codes */}
        <div className="lg:col-span-5 space-y-4">
          {/* Promo code box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" /> Промокод на скидку
            </h4>

            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-emerald-400 text-xs">{appliedPromo.code}</span>
                    <p className="text-[10px] text-slate-300">Скидка {appliedPromo.discountPercent}% применена</p>
                  </div>
                </div>
                <button
                  onClick={onRemovePromo}
                  className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  Отменить
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Например: MONIS05"
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase tracking-wider focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Применить
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                
                {/* Available Quick Promos */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 py-0.5">Доступно:</span>
                  <button
                    type="button"
                    onClick={() => onApplyPromo('MONIS05')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 cursor-pointer"
                  >
                    MONIS05 (-15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => onApplyPromo('ELECTRO10')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 cursor-pointer"
                  >
                    ELECTRO10 (-10%)
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Totals Summary */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Сумма заказа
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Товары ({items.length}):</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Скидка ({appliedPromo?.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Доставка ({currentCity}):</span>
                <span className="font-semibold text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400">Бесплатно</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
            </div>

            {/* Total and Installment */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-bold text-slate-200">Итого:</span>
                <span className="text-2xl font-black text-white">{formatPrice(totalAmount)}</span>
              </div>

              {/* Kaspi 0-0-12 Monthly badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                  <Zap className="w-3.5 h-3.5 fill-red-400" />
                  <span>Kaspi Рассрочка 0-0-12:</span>
                </div>
                <span className="text-xs font-black text-white">
                  {formatInstallment(totalAmount, 12)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onOpenCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
