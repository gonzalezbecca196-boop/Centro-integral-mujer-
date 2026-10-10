import React, { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  Shield,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Check,
  HelpCircle,
  LogIn,
  Database,
  Layers,
  FileSpreadsheet,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface PerfilScreenProps {
  currentUser?: FirebaseUser | null;
  onLogout: () => void;
  onOpenEmergency: () => void;
  onOpenLogin: () => void;
}

export const PerfilScreen: React.FC<PerfilScreenProps> = ({
  currentUser,
  onLogout,
  onOpenEmergency,
  onOpenLogin,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [exported, setExported] = useState(false);

  const displayName = currentUser?.displayName || 'Coordinación CIM Mugica';
  const email = currentUser?.email || 'gonzalezbecca196@gmail.com';
  const photoURL = currentUser?.photoURL;

  const handleExportData = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 animate-in fade-in duration-200">
      {/* Staff Profile Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl bg-purple-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-purple-200">
            {displayName.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>

        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
            Equipo Profesional & Administración
          </span>
        </div>
        <h3 className="font-extrabold text-slate-900 text-lg">{displayName}</h3>
        <p className="text-xs text-slate-500">{email}</p>

        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>CIM Padre Carlos Mugica • Retiro, CABA</span>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenLogin}
            className="mt-3 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Ingresar con Credenciales Oficiales</span>
          </button>
        )}
      </div>

      {/* Database & Architecture Specification */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
          <Database className="w-5 h-5 text-purple-700" />
          <span>Base de Datos del Sistema</span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-purple-100">
            <span className="text-slate-500 font-medium">Motor de Datos:</span>
            <span className="font-bold text-slate-900">Firestore (NoSQL Documental)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-purple-100">
            <span className="text-slate-500 font-medium">ID de Base de Datos:</span>
            <span className="font-mono text-[10px] font-bold text-purple-800">
              ai-studio-remixremixcimmug...
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-purple-100">
            <span className="text-slate-500 font-medium">Estado de Conexión:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sincronizado en Tiempo Real
            </span>
          </div>
        </div>
      </div>

      {/* Export Reports & Statistics */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Informes Estadísticos</h4>
            <p className="text-xs text-slate-500">Exportar métricas mensuales de atenciones CIM</p>
          </div>
          <FileSpreadsheet className="w-5 h-5 text-purple-700" />
        </div>

        {exported ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Planilla generada con éxito (Descargando resumen estadístico).</span>
          </div>
        ) : (
          <button
            onClick={handleExportData}
            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Generar Reporte Estadístico (Excel / PDF)</span>
          </button>
        )}
      </div>

      {/* Staff Preferences & Alerts */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">Avisos Operativos</h4>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Alertas de Urgencia 144 / OVD</p>
              <p className="text-[11px] text-slate-500">Notificar al ingresar derivaciones de alto riesgo</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              notificationsEnabled ? 'bg-purple-700' : 'bg-slate-200'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                notificationsEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión Administrativa</span>
        </button>
      </div>
    </div>
  );
};
