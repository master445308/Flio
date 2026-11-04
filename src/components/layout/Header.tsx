import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Zap,
  X,
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { KAZAKHSTAN_CITIES } from '../../data/initialData';
import { ActiveTab } from '../../types';

interface HeaderProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  cartCount: number;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  favoritesCount,
  cartCount,
  activeTab,
  onTabChange,
  isAdmin,
  onToggleAdmin,
}) => {
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Electro<span className="text-cyan-400">Nova</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md">
                  ₸ KZT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden xs:block">
                Электроника в Казахстане
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCityMenu(!showCityMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">{currentCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCityMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[11px] font-medium text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Город доставки:
                </div>
                {KAZAKHSTAN_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setShowCityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      currentCity === city
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'catalog' && e.target.value.trim().length > 0) {
                    onTabChange('catalog');
                  }
                }}
                placeholder="Поиск смартфонов, ноутбуков, Kaspi Red..."
                className="w-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 text-sm rounded-xl pl-10 pr-9 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Поиск"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Wishlist Button */}
            <button
              onClick={() => onTabChange('favorites')}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Избранное"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden lg:inline text-xs font-medium">Избранное</span>
              {favoritesCount > 0 && (
                <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => onTabChange('cart')}
              className={`relative p-2 sm:px-3.5 sm:py-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'cart'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white'
              }`}
              title="Корзина"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-extrabold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold">Корзина</span>
            </button>

            {/* Admin Switch */}
            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-purple-600/25 border-purple-500/60 text-purple-300'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isAdmin ? 'Выйти из режима управления' : 'Панель управления магазином'}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">Админ</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 pt-1 border-t border-slate-800/60 animate-in fade-in">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'catalog' && e.target.value.trim().length > 0) {
                    onTabChange('catalog');
                  }
                }}
                placeholder="Поиск товаров в тенге..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl pl-9 pr-9 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile City Selector Pill */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-cyan-400" /> Город:
              </span>
              {KAZAKHSTAN_CITIES.slice(0, 5).map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full shrink-0 ${
                    currentCity === city
                      ? 'bg-cyan-500 text-white font-medium'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
