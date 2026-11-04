import React from 'react';
import { Home, Grid, Heart, ShoppingBag, Package } from 'lucide-react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
  cartCount: number;
  ordersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  cartCount,
  ordersCount,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Главная',
      icon: Home,
    },
    {
      id: 'catalog' as ActiveTab,
      label: 'Каталог',
      icon: Grid,
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'Избранное',
      icon: Heart,
      badge: favoritesCount,
    },
    {
      id: 'cart' as ActiveTab,
      label: 'Корзина',
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      id: 'orders' as ActiveTab,
      label: 'Заказы',
      icon: Package,
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-5 h-15">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all select-none active:scale-95 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  } ${item.id === 'favorites' && isActive ? 'fill-rose-500 text-rose-500' : ''}`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[9px] font-extrabold shadow-sm animate-in zoom-in-50">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
