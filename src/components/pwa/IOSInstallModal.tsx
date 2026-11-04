import React from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <img src="/pwa-192x192.png" alt="ElectroNova" className="w-full h-full rounded-[10px] object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Установка ElectroNova</h3>
              <p className="text-xs text-slate-400">На iPhone или iPad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-blue-500/20 text-cyan-400 shrink-0">
              <Share className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">1. Нажмите «Поделиться»</p>
              <p className="text-xs text-slate-400 mt-0.5">В нижней панели браузера Safari нажмите иконку экспорта.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">2. «На экран «Домой»»</p>
              <p className="text-xs text-slate-400 mt-0.5">Прокрутите список действий вниз и выберите пункт добавления на экран.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">3. Наслаждайтесь приложением</p>
              <p className="text-xs text-slate-400 mt-0.5">Приложение запустится в полноэкранном режиме с поддержкой офлайн-работы!</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-medium text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
