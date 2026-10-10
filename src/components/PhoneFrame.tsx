import React from 'react';
import { Smartphone, Maximize2, Minimize2, Battery, Wifi, Signal, Building2 } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFramed: () => void;
  onShowLogin: () => void;
  onOpenRutasModal?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isFramed,
  onToggleFramed,
  onShowLogin,
  onOpenRutasModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-5 select-none font-sans">
      {/* Top Administrative Bar */}
      <div className={`w-full ${isFramed ? 'max-w-md' : 'max-w-4xl'} flex items-center justify-between py-2 px-3 text-xs text-slate-300 mb-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-md transition-all`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="font-bold text-white tracking-tight">CIM Padre Mugica</span>
          <span className="text-purple-300 text-[10px] font-semibold bg-purple-950/80 border border-purple-800/80 px-2 py-0.5 rounded-md hidden sm:inline">
            Sistema Administrativo
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRutasModal && (
            <button
              onClick={onOpenRutasModal}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ver Rutas OK</span>
            </button>
          )}

          <button
            onClick={onShowLogin}
            className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-colors"
          >
            Acceso Personal
          </button>

          <button
            onClick={onToggleFramed}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition-colors"
            title={isFramed ? 'Ver en consola de escritorio completa' : 'Ver en formato terminal móvil'}
          >
            {isFramed ? (
              <>
                <Maximize2 className="w-3 h-3 text-purple-400" />
                <span className="hidden sm:inline">Escritorio</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-purple-400" />
                <span className="hidden sm:inline">Móvil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area: Phone Mockup or Wide Desktop Administrative Console */}
      {isFramed ? (
        <div className="relative my-auto">
          {/* External Phone Hardware Frame */}
          <div className="w-[375px] sm:w-[390px] h-[812px] bg-slate-800 rounded-[50px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] border-4 border-slate-700/80 relative flex flex-col">
            <div className="absolute -left-[7px] top-[115px] w-[3px] h-[32px] bg-slate-600 rounded-l-sm" />
            <div className="absolute -left-[7px] top-[160px] w-[3px] h-[45px] bg-slate-600 rounded-l-sm" />
            <div className="absolute -left-[7px] top-[215px] w-[3px] h-[45px] bg-slate-600 rounded-l-sm" />
            <div className="absolute -right-[7px] top-[150px] w-[3px] h-[65px] bg-slate-600 rounded-r-sm" />

            {/* Inner Display screen */}
            <div className="w-full h-full bg-[#fbf9fe] rounded-[40px] overflow-hidden flex flex-col relative border border-slate-200/20 shadow-inner">
              {/* Phone Status Bar */}
              <div className="h-9 px-6 pt-2 flex items-center justify-between text-slate-800 text-[11px] font-semibold select-none z-40 bg-white/95">
                <span>09:41</span>
                <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Scrollable App Viewport */}
              <div className="flex-1 overflow-y-auto relative scrollbar-thin">
                {children}
              </div>

              {/* Home Indicator Bar */}
              <div className="h-4 flex items-center justify-center pb-1 z-40 bg-white/95">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Wide Desktop Console View */
        <div className="w-full max-w-4xl min-h-[820px] bg-[#fbf9fe] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-purple-100/90 relative">
          <div className="flex-1 overflow-y-auto relative">{children}</div>
        </div>
      )}
    </div>
  );
};
