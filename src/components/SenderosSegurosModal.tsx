import React, { useState } from 'react';
import {
  X,
  Compass,
  MapPin,
  ShieldCheck,
  Phone,
  AlertTriangle,
  Radio,
  Eye,
  Store,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  Footprints,
  Sparkles,
  Users,
} from 'lucide-react';
import { SENDEROS_DATA } from '../data/mockData';
import { SenderoRoute } from '../types';

interface SenderosSegurosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSenderoId?: string;
  onOpenSacarTurno?: () => void;
  onOpenEmergency?: () => void;
}

export const SenderosSegurosModal: React.FC<SenderosSegurosModalProps> = ({
  isOpen,
  onClose,
  initialSenderoId,
  onOpenSacarTurno,
  onOpenEmergency,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    initialSenderoId || SENDEROS_DATA[0].id
  );
  const [accompanimentRequested, setAccompanimentRequested] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>('');

  if (!isOpen) return null;

  const currentRoute =
    SENDEROS_DATA.find((r) => r.id === selectedRouteId) || SENDEROS_DATA[0];

  const handleRequestAccompaniment = () => {
    setAccompanimentRequested(true);
    setTimeout(() => {
      // Keep confirmation visible
    }, 3000);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSuccess(true);
    setReportText('');
    setTimeout(() => {
      setShowReportForm(false);
      setReportSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">
                  Rutas del Sendero Seguro
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                  4 Rutas Activas
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Corredores iluminados, monitoreados y con acompañamiento al CIM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Senderos Selector Tabs */}
        <div className="px-3 pt-2.5 pb-2 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
          {SENDEROS_DATA.map((r, index) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRouteId(r.id);
                setAccompanimentRequested(false);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRouteId === r.id
                  ? 'bg-purple-700 text-white shadow-xs scale-102'
                  : 'bg-white text-slate-700 hover:bg-purple-100/70 border border-slate-200'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Sendero {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Active Route Overview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/40 border border-purple-200 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  Corredor Seguro Oficial
                </span>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {currentRoute.name}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  {currentRoute.safetyScore}% Seguro
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {currentRoute.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-100 text-center">
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="text-[10px] text-slate-400 block font-medium">Distancia</span>
                <span className="text-xs font-bold text-slate-800">{currentRoute.distance}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="text-[10px] text-slate-400 block font-medium">Tiempo estimado</span>
                <span className="text-xs font-bold text-purple-700">{currentRoute.walkingTime}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="text-[10px] text-slate-400 block font-medium">Iluminación</span>
                <span className="text-xs font-bold text-emerald-600">LED Reforzada</span>
              </div>
            </div>
          </div>

          {/* Interactive Route Walkthrough (Checkpoints) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-purple-600" />
                <span>Puntos Seguros del Recorrido</span>
              </h5>
              <span className="text-[11px] text-slate-400">
                {currentRoute.checkpoints.length} paradas protegidas
              </span>
            </div>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
              {currentRoute.checkpoints.map((cp, idx) => (
                <div key={cp.id} className="relative group">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                      idx === 0
                        ? 'bg-purple-700 ring-2 ring-purple-200'
                        : idx === currentRoute.checkpoints.length - 1
                          ? 'bg-emerald-600 ring-2 ring-emerald-200'
                          : 'bg-indigo-600'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-bold text-slate-900">
                        {cp.name}
                      </h6>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {cp.type === 'totem' && '🚨 Tótem SOS'}
                        {cp.type === 'camara' && '📹 Cámara CMU'}
                        {cp.type === 'comercio' && '🏪 Punto Amigo'}
                        {cp.type === 'transporte' && '🚏 Transbordo'}
                        {cp.type === 'salud' && '🏥 Centro Salud'}
                        {cp.type === 'posta' && '📍 Sede CIM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {cp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Accompaniment Actions */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-indigo-950">
                    Acompañamiento en el Sendero
                  </h5>
                  <p className="text-[10px] text-indigo-700">
                    ¿Vas a una consulta o taller? Promotoras barriales te esperan en el inicio del sendero.
                  </p>
                </div>
              </div>
            </div>

            {accompanimentRequested ? (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ¡Solicitud confirmada! Una promotora territorial de guardia te contactará para coordinar la caminata segura.
                </span>
              </div>
            ) : (
              <button
                onClick={handleRequestAccompaniment}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-98"
              >
                <Footprints className="w-4 h-4" />
                <span>Pedir Acompañamiento en Sendero</span>
              </button>
            )}
          </div>

          {/* Report an Issue on Path (Luminarias rotas, obstrucciones) */}
          <div className="pt-1">
            {!showReportForm ? (
              <button
                onClick={() => setShowReportForm(true)}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-purple-700 font-semibold underline underline-offset-2 flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>¿Hay una luminaria apagada o problema en el sendero? Reportar acá</span>
              </button>
            ) : (
              <form onSubmit={handleSendReport} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Reportar anomalía en el sendero
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>
                <input
                  type="text"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Ej: Foco titilando en Calle 12 y Castillo..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Enviar aviso a Mantenimiento Comunitario
                </button>
                {reportSuccess && (
                  <p className="text-[11px] text-emerald-700 font-bold text-center">
                    ✓ Reporte registrado. Gracias por cuidar el sendero de todas.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          {onOpenSacarTurno && (
            <button
              onClick={() => {
                onClose();
                onOpenSacarTurno();
              }}
              className="px-3 py-2 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>Sacar Turno con Sendero</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs text-center transition-colors shadow-xs"
          >
            Entendido, cerrar mapa
          </button>
        </div>
      </div>
    </div>
  );
};
