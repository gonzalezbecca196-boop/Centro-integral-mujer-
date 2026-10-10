import React from 'react';
import { CloudSun, Search, Bookmark, ChevronLeft, RefreshCw } from 'lucide-react';

interface CamouflageScreenProps {
  onExitCamouflage: () => void;
}

export const CamouflageScreen: React.FC<CamouflageScreenProps> = ({
  onExitCamouflage,
}) => {
  return (
    <div className="min-h-full bg-amber-50/40 text-slate-800 p-4 space-y-4 font-sans select-none animate-in fade-in duration-100">
      {/* Harmless Header */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            R
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Recetas y Cocina Casera
            </h1>
            <p className="text-[10px] text-slate-500">Comidas fáciles de la semana</p>
          </div>
        </div>

        {/* Discreet Return Button disguised as a tiny refresh icon */}
        <button
          onClick={onExitCamouflage}
          title="Actualizar recetas"
          aria-label="Restaurar vista"
          className="w-8 h-8 rounded-full bg-white border border-amber-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weather snippet */}
      <div className="p-3 rounded-2xl bg-white border border-amber-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CloudSun className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-xs font-bold text-slate-800">Buenos Aires • 22°C</p>
            <p className="text-[10px] text-slate-500">Parcialmente nublado</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Hoy
        </span>
      </div>

      {/* Search Recipe */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value="Buscar recetas de guisados y pastas..."
          className="w-full px-3 py-2 pl-9 rounded-xl bg-white border border-amber-200 text-xs text-slate-500 shadow-xs cursor-default"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Recipe Card 1 */}
      <div className="rounded-2xl bg-white border border-amber-100 overflow-hidden shadow-xs">
        <div className="h-32 bg-amber-100/70 relative">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            alt="Ensalada fresca y tarta de verduras"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>⏱️ 25 min</span>
            <span>Económica • 4 porciones</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Tarta casera de acelga y calabaza
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Una opción nutritiva, rápida y económica para resolver la cena familiar.
          </p>
        </div>
      </div>

      {/* Recipe Card 2 */}
      <div className="rounded-2xl bg-white border border-amber-100 p-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 mb-1">
          Guiso de lentejas tradicional
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Ingredientes simples: lentejas, papas, zanahoria, cebolla y salsa de tomate.
        </p>
      </div>

      {/* Subtle restore button at bottom */}
      <div className="pt-4 text-center">
        <button
          onClick={onExitCamouflage}
          className="text-[11px] text-slate-400 hover:text-purple-700 underline transition-colors"
        >
          Volver a la aplicación
        </button>
      </div>
    </div>
  );
};
