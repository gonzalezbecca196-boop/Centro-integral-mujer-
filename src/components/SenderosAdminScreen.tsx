import React, { useState } from 'react';
import {
  Compass,
  Footprints,
  ShieldCheck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  Users,
  Plus,
  X,
  PhoneCall,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SenderoRoute, SenderoReport } from '../types';

interface SenderosAdminScreenProps {
  senderos: SenderoRoute[];
  reports: SenderoReport[];
  onUpdateReportStatus: (
    reportId: string,
    newStatus: 'pendiente' | 'en_reparacion' | 'resuelto',
    assignedPromotora?: string
  ) => void;
  onCreateReport: (newReport: SenderoReport) => void;
  onOpenCenterMap?: () => void;
}

export const SenderosAdminScreen: React.FC<SenderosAdminScreenProps> = ({
  senderos,
  reports,
  onUpdateReportStatus,
  onCreateReport,
  onOpenCenterMap,
}) => {
  const [selectedSenderoId, setSelectedSenderoId] = useState<string>(senderos[0]?.id || 'sendero-1');
  const [activeTab, setActiveTab] = useState<'corredores' | 'reportes'>('corredores');

  // Modal for new inspection / report
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [formSenderoId, setFormSenderoId] = useState(senderos[0]?.id || 'sendero-1');
  const [formPunto, setFormPunto] = useState('');
  const [formTipo, setFormTipo] = useState<'luminaria' | 'totem' | 'camara' | 'obstruccion' | 'acompanamiento'>('luminaria');
  const [formDesc, setFormDesc] = useState('');
  const [formPromotora, setFormPromotora] = useState('Rosa Benítez');

  const activeSendero = senderos.find((s) => s.id === selectedSenderoId) || senderos[0];

  const pendingReportsCount = reports.filter((r) => r.estado === 'pendiente').length;

  const handleCreateReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPunto.trim()) return;

    const matchedSendero = senderos.find((s) => s.id === formSenderoId);

    const newReport: SenderoReport = {
      id: `rep-${Date.now()}`,
      senderoId: formSenderoId,
      senderoName: matchedSendero?.name || 'Sendero Seguro',
      puntoAfectado: formPunto.trim(),
      tipoProblema: formTipo,
      descripcion: formDesc.trim() || 'Inspección técnica reportada por personal de guardia.',
      estado: 'pendiente',
      fechaReporte: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      promotoraAsignada: formPromotora,
      reportadoPor: 'Guardia Administrativa CIM',
    };

    onCreateReport(newReport);
    setIsReportModalOpen(false);
    setFormPunto('');
    setFormDesc('');
  };

  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-200">
      {/* Title & Add Incident Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Infraestructura y Monitoreo Territorial
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Senderos Seguros Mugica
          </h2>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Incidencia</span>
        </button>
      </div>

      {/* Overview Status KPIs */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Corredores
          </span>
          <span className="text-lg font-black text-slate-900">{senderos.length} Activos</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
            Por Reparar
          </span>
          <span className="text-lg font-black text-amber-700">{pendingReportsCount}</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Promotoras
          </span>
          <span className="text-lg font-black text-emerald-700">6 En Turno</span>
        </div>
      </div>

      {/* Tab Switcher: Corredores vs Bandeja de Reportes */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-purple-50/80 rounded-2xl border border-purple-100 text-xs font-bold">
        <button
          onClick={() => setActiveTab('corredores')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'corredores'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Corredores y Tótems ({senderos.length})
        </button>
        <button
          onClick={() => setActiveTab('reportes')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'reportes'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          <span>Bandeja de Reparaciones</span>
          {pendingReportsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center">
              {pendingReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CORREDORES MONITOREADOS */}
      {activeTab === 'corredores' && (
        <div className="space-y-3.5">
          {/* Sendero selector pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {senderos.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedSenderoId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedSenderoId === s.id
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Sendero {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Sendero Detailed Card */}
          <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  {activeSendero.statusText}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                  {activeSendero.name}
                </h3>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                {activeSendero.safetyScore}% Operativo
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSendero.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Horario Protegido</span>
                <span className="font-bold text-slate-800">{activeSendero.recommendedHours}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Iluminación LED</span>
                <span className="font-bold text-emerald-600">{activeSendero.lighting}</span>
              </div>
            </div>

            {/* Checkpoints with Technical Status */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                <span>Puntos de Monitoreo del Corredor</span>
              </h4>
              <div className="space-y-1.5">
                {activeSendero.checkpoints.map((cp, idx) => (
                  <div
                    key={cp.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block">{cp.name}</span>
                        <span className="text-[10px] text-slate-500">{cp.description}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-white border border-slate-200 px-2 py-0.5 rounded text-emerald-700 shrink-0">
                      Operativo
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotoras asignadas */}
            {activeSendero.promotorasAsignadas && (
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-950 font-semibold">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Promotoras en ronda: {activeSendero.promotorasAsignadas.join(', ')}</span>
                </div>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  En Servicio
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BANDEJA DE REPARACIONES E INCIDENCIAS */}
      {activeTab === 'reportes' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <p className="text-xs text-slate-500">
            Gestioná y marcá como resueltas las alertas de luminarias rotas, tótems y solicitudes de acompañamiento reportadas en los senderos.
          </p>

          {reports.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-2xl border transition-all ${
                report.estado === 'pendiente'
                  ? 'bg-amber-50/60 border-amber-200'
                  : report.estado === 'en_reparacion'
                  ? 'bg-blue-50/60 border-blue-200'
                  : 'bg-white border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        report.estado === 'pendiente'
                          ? 'bg-amber-200 text-amber-900'
                          : report.estado === 'en_reparacion'
                          ? 'bg-blue-200 text-blue-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {report.estado === 'pendiente' && '⚠️ Falta Reparar'}
                      {report.estado === 'en_reparacion' && '🔧 En Reparación'}
                      {report.estado === 'resuelto' && '✓ Reparado / Resuelto'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {report.fechaReporte}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {report.puntoAfectado}
                  </h4>
                  <p className="text-[11px] text-purple-700 font-medium">
                    {report.senderoName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-100">
                {report.descripcion}
              </p>

              {/* Administrative Actions to resolve/repair */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] text-slate-500">
                  Responsable: <strong>{report.promotoraAsignada || 'Guardia CIM'}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {report.estado !== 'resuelto' && (
                    <button
                      onClick={() => onUpdateReportStatus(report.id, 'resuelto')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar Reparado</span>
                    </button>
                  )}

                  {report.estado === 'pendiente' && (
                    <button
                      onClick={() => onUpdateReportStatus(report.id, 'en_reparacion')}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>En Reparación</span>
                    </button>
                  )}

                  {report.estado === 'resuelto' && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completado</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE INSPECTION REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm">Registrar Incidencia en Sendero</h3>
                <p className="text-[11px] text-purple-200">
                  Control técnico y mantenimiento de seguridad urbana
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReportSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sendero Seguro Afectado</label>
                <select
                  value={formSenderoId}
                  onChange={(e) => setFormSenderoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  {senderos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Esquina o Punto Afectado *</label>
                <input
                  type="text"
                  required
                  value={formPunto}
                  onChange={(e) => setFormPunto(e.target.value)}
                  placeholder="Ej: Calle 12 y Castillo frente a farmacia..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Incidencia</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  <option value="luminaria">💡 Luminaria LED rota o titilando</option>
                  <option value="totem">🚨 Tótem SOS sin audio o con falla</option>
                  <option value="camara">📹 Cámara CMU desalineada o sin visión</option>
                  <option value="obstruccion">🚧 Obstrucción en vereda / residuos</option>
                  <option value="acompanamiento">🚶 Acompañamiento a pie solicitado</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detalle del Informe</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detalles para el personal de alumbrado o promotoras..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Promotora / Guardia Asignada</label>
                <input
                  type="text"
                  value={formPromotora}
                  onChange={(e) => setFormPromotora(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
                >
                  Guardar Incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
