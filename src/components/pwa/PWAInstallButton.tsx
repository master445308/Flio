import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // If already installed, hide the install button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${className}`}
        title="Установить приложение ElectroNova"
      >
        <div className="relative">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-y-0.5" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
        </div>
        <span>{variant === 'full' ? 'Установить мобильное приложение' : 'Скачать PWA'}</span>
        <Sparkles className="w-3 h-3 text-cyan-200 hidden sm:inline" />
      </button>

      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />

      {showGenericModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowGenericModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <img src="/pwa-192x192.png" alt="ElectroNova" className="w-10 h-10 rounded-xl" />
              <div>
                <h4 className="font-semibold text-white">Приложение ElectroNova</h4>
                <p className="text-xs text-slate-400">PWA для Android и iOS</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Вы можете установить приложение прямо из меню браузера:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="font-bold text-cyan-400">Chrome:</span>
                <span>Нажмите иконку ⊕ в строке адреса или в меню «Установить»</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="font-bold text-blue-400">Safari:</span>
                <span>«Поделиться» → «На экран Домой»</span>
              </li>
            </ul>
            <button
              onClick={() => setShowGenericModal(false)}
              className="mt-5 w-full py-2 rounded-xl bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};
