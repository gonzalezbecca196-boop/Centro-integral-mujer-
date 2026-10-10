import React from 'react';
import {
  X,
  Phone,
  Home,
  Calendar,
  CalendarPlus,
  MessageSquare,
  MapPin,
  GraduationCap,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Database,
  Users,
} from 'lucide-react';
import { TabType } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface DrawerNavProps {
  currentUser?: FirebaseUser | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onOpenSacarTurno: () => void;
  onOpenCentros: () => void;
  onOpenEmergency: () => void;
  onOpenTalleresInfo: () => void;
  onOpenSettings: () => void;
  onOpenSenderos?: () => void;
  onLogout: () => void;
}

export const DrawerNav: React.FC<DrawerNavProps> = ({
  currentUser,
  isOpen,
  onClose,
  onNavigate,
  onOpenSacarTurno,
  onOpenCentros,
  onOpenEmergency,
  onOpenTalleresInfo,
  onOpenSettings,
  onOpenSenderos,
  onLogout,
}) => {
  if (!isOpen) return null;

  const displayName = currentUser?.displayName || 'Coordinación CIM Mugica';
  const email = currentUser?.email || 'gonzalezbecca196@gmail.com';
  const photoURL = currentUser?.photoURL;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        id="drawer-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer panel */}
      <aside
        id="sidebar-navigation-drawer"
        className="absolute top-0 bottom-0 left-0 w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col z-10 transition-transform animate-in slide-in-from-left duration-300 overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-purple-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-sm block">
                CIM Padre Mugica
              </span>
              <span className="text-[10px] text-purple-200 block">
                Portal de Administración y Guardia
              </span>
            </div>
          </div>

          <button
            id="btn-close-drawer"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="w-7 h-7 rounded-lg bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Staff User Card */}
        <div className="p-3.5 mx-4 mt-4 rounded-2xl bg-purple-50/80 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-xs truncate">
                {displayName}
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                {email}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-purple-200 text-purple-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Equipo Profesional • Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-3 space-y-4 text-xs">
          {/* Group 1: Gestión de Casos & Turnos */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
              Operaciones Principales
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-purple-700" />
                  <span>Inicio</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigate('agenda');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <span>Agenda y Consultorios</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSacarTurno();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <CalendarPlus className="w-4 h-4 text-emerald-700" />
                  <span>Asignar Nuevo Turno</span>
                </div>
                <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                  + Turno
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCentros();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  <span>Consultorios e Instalaciones</span>
                </div>
                <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                  CIM Mugica
                </span>
              </button>
            </div>
          </div>

          {/* Group 3: Comunicación y Enlace */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
              Comunicación y Enlace
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('chat');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                  <span>Chat</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-purple-600" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenEmergency();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <div className="text-left">
                    <span className="block font-bold text-slate-900 text-xs">Guardia 144 / 911</span>
                    <span className="block text-[10px] text-slate-500">Derivación directa institucional</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Logout & App Version */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            id="drawer-btn-logout"
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión administrativa</span>
          </button>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400">
              Sistema de Gestión CIM Mugica • v2.0 Admin
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
