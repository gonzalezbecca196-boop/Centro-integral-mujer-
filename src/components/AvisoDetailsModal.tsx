import React, { useState } from 'react';
import { X, Calendar, ArrowRight, Tag, Share2, Check, Users, Building2 } from 'lucide-react';
import { Aviso } from '../types';

interface AvisoDetailsModalProps {
  aviso: Aviso | null;
  onClose: () => void;
  onActionClick: (aviso: Aviso) => void;
}

export const AvisoDetailsModal: React.FC<AvisoDetailsModalProps> = ({
  aviso,
  onClose,
  onActionClick,
}) => {
  const [copied, setCopied] = useState(false);

  if (!aviso) return null;

  const handleShare = async () => {
    const text = `${aviso.title} - ${aviso.description} (CIM Mugica)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: aviso.title,
          text,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-900 text-white">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
            {aviso.tag}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title="Copiar texto oficial"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-xs transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <span className="text-[10px] text-purple-700 font-bold block mb-0.5">
              Convocatoria Oficial CIM
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              {aviso.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-800 font-bold bg-purple-50 p-2.5 rounded-xl border border-purple-200">
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>Fecha / Horario: {aviso.date}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {aviso.description}
          </p>

          {/* Quota and Enrolled */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Inscriptas</span>
              <span className="text-base font-black text-purple-800">
                {aviso.inscriptasCount || 18}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Cupo Máximo</span>
              <span className="text-base font-black text-purple-800">
                {aviso.cupoMaximo || 25}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Sede Central CIM Mugica (Av. Ramón Castillo y Calle 12)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
          >
            Cerrar
          </button>

          <button
            onClick={() => {
              onClose();
              onActionClick(aviso);
            }}
            className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
          >
            <span>Asignar Turno / Taller</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
