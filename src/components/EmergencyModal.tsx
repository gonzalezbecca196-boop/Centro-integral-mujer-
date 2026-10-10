import React from 'react';
import { X, Phone, ShieldAlert, HeartHandshake, MessageCircle, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Urgent Header */}
        <div className="p-4 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Asistencia y Urgencias
              </h3>
              <p className="text-[11px] text-rose-100 font-medium">
                Atención gratuita 24hs los 365 días
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Si estás atravesando una situación de violencia por motivos de género o necesitás contención inmediata, comunicate de forma gratuita:
          </p>

          {/* Línea 144 Direct Call Button */}
          <a
            href="tel:144"
            className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                  Línea 144 (Nacional)
                </span>
                <span className="text-sm font-black text-slate-900">
                  Llamar al 144
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 group-hover:translate-x-0.5 transition-transform">
              Llamar →
            </span>
          </a>

          {/* 911 Urgencias Inmediatas */}
          <a
            href="tel:911"
            className="w-full p-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-red-100 uppercase tracking-wider block">
                  Peligro Inminente
                </span>
                <span className="text-sm font-black">Llamar al 911</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-white text-red-600 px-2.5 py-1 rounded-lg">
              Emergencia
            </span>
          </a>

          {/* WhatsApp Línea 144 */}
          <a
            href="https://wa.me/5491127716463?text=Hola,%20necesito%20asistencia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  WhatsApp 144 (Chat Silencioso)
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Escribir por WhatsApp
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Abrir →</span>
          </a>

          {/* CIM Mugica Direct Center Telephone */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Guardia CIM Mugica:</span>
            <span className="font-bold text-purple-700">011 4310-8000</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
