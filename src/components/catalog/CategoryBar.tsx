import React from 'react';
import {
  Grid,
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Tv,
  Cpu,
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  productCounts?: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts = {},
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return Smartphone;
      case 'Laptop':
        return Laptop;
      case 'Headphones':
        return Headphones;
      case 'Gamepad2':
        return Gamepad2;
      case 'Watch':
        return Watch;
      case 'Tv':
        return Tv;
      case 'Cpu':
        return Cpu;
      default:
        return Grid;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {categories.map((cat) => {
          const Icon = getIcon(cat.icon);
          const isSelected = selectedCategory === cat.id;
          const count = productCounts[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-cyan-400'}`} />
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
