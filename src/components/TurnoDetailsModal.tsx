import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  PhoneCall,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { Turno } from '../types';

interface TurnoDetailsModalProps {
  turno: Turno | null;
  onClose: () => void;
  onCancelTurno: (id: string) => void;
  onCompleteTurno: (id: string) => void;
  onCallToRoom?: (id: string) => void;
}

export const TurnoDetailsModal: React.FC<TurnoDetailsModalProps> = ({
  turno,
  onClose,
  onCancelTurno,
  onCompleteTurno,
  onCallToRoom,
}) => {
  if (!turno) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-900 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
              Ficha Administrativa de Consulta
            </span>
            <h3 className="font-extrabold text-sm text-white">
              {turno.nombreUsuaria || turno.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {turno.serviceType.toUpperCase()}
            </span>
            {turno.urgency === 'alta' && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                🔴 Alta / Urgente
              </span>
            )}
          </div>

          <div>
            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {turno.title}
            </h4>
            {turno.dni && (
              <p className="text-[11px] text-slate-500 mt-0.5">DNI Usuaria: {turno.dni}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2 text-slate-700">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
              <span className="font-bold text-slate-900">{turno.dateLabel}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-purple-700 shrink-0" />
              <span>
                Atiende: <strong>{turno.professional || 'Equipo de Guardia'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span>
                Lugar: <strong>{turno.consultorio || turno.location}</strong> ({turno.location})
              </span>
            </div>

            {turno.notes && (
              <div className="pt-2 border-t border-purple-100/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Notas de citación:
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded-xl border border-purple-100">
                  {turno.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Estado Operativo:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md ${
                turno.status === 'en_atencion'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : turno.status === 'confirmado'
                  ? 'bg-emerald-100 text-emerald-800'
                  : turno.status === 'completado'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {turno.status === 'en_atencion' && 'En Sala de Atención'}
              {turno.status === 'confirmado' && 'Confirmado'}
              {turno.status === 'completado' && 'Atendido / Completado'}
              {turno.status === 'cancelado' && 'Cancelado'}
              {turno.status === 'pendiente' && 'Pendiente de Confirmación'}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          {turno.status !== 'en_atencion' && turno.status !== 'completado' && onCallToRoom && (
            <button
              onClick={() => {
                onCallToRoom(turno.id);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Llamar a Sala</span>
            </button>
          )}

          {turno.status !== 'completado' && (
            <button
              onClick={() => {
                onCompleteTurno(turno.id);
                onClose();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Marcar Atendido</span>
            </button>
          )}

          <button
            onClick={() => {
              onCancelTurno(turno.id);
              onClose();
            }}
            className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
