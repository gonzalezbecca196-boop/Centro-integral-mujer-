import React from 'react';
import { X, MapPin, Clock, Phone, Navigation, Building2, ShieldCheck } from 'lucide-react';
import { CENTROS_DATA } from '../data/mockData';

interface CentrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSedeForTurno: (sedeName: string) => void;
  onViewSendero?: (sedeName: string) => void;
}

export const CentrosModal: React.FC<CentrosModalProps> = ({
  isOpen,
  onClose,
  onSelectSedeForTurno,
  onViewSendero,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">
                Instalaciones y Consultorios
              </h3>
              <p className="text-[10px] text-purple-200">
                CIM Padre Carlos Mugica • Retiro, CABA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {CENTROS_DATA.map((centro) => (
            <div
              key={centro.id}
              className="p-4 rounded-2xl border bg-purple-50/30 border-purple-200 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-700 text-white uppercase tracking-wider mb-1 inline-block">
                    CIM Mugica • Retiro
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {centro.name}
                  </h4>
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-medium text-slate-800">
                    {centro.address} • Retiro, CABA
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{centro.hours}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Guardia: <strong className="text-purple-800">{centro.phone}</strong></span>
                </div>
              </div>

              {/* Consultorios y Salas Internas de la Sede */}
              <div className="pt-2.5 border-t border-purple-100">
                <span className="text-[10px] text-slate-700 font-bold block mb-1.5 uppercase tracking-wider">
                  Salas y Boxes de Atención Interna:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">Consultorio 1 (PB)</span>
                      <span className="text-[10px] text-slate-500">Primera Escucha y Admisión Interdisciplinaria</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Activo</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">Consultorio 2 (PA)</span>
                      <span className="text-[10px] text-slate-500">Psicoterapia Individual y Atención Psicosocial</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Activo</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">Box Legal 1</span>
                      <span className="text-[10px] text-slate-500">Patrocinio Jurídico y Medidas Cautelares</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Activo</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">Box Social 1</span>
                      <span className="text-[10px] text-slate-500">Trabajo Social y Gestión Habitacional</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Activo</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">Sala de Talleres y Reuniones</span>
                      <span className="text-[10px] text-slate-500">Autonomía Económica y Pase de Guardia</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Disponible</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    onSelectSedeForTurno(centro.name);
                    onClose();
                  }}
                  className="py-1.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
                >
                  Asignar turno en el centro →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
          >
            Cerrar Directorio
          </button>
        </div>
      </div>
    </div>
  );
};
