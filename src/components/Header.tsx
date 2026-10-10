import React from 'react';
import { Menu, Bell, Building2, ShieldCheck, UserCheck } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
  userPhotoURL?: string;
  userName?: string;
  activeSede?: string;
  onSelectSede?: (sede: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenDrawer,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 3,
  userPhotoURL,
  userName = 'Equipo de Coordinación',
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 px-4 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Left: Drawer button & Portal Identification */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-drawer"
            onClick={onOpenDrawer}
            aria-label="Abrir panel administrativo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:text-purple-800 hover:bg-purple-50 transition-colors active:scale-95 border border-slate-200"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                  CIM <span className="text-purple-700">Mugica</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                Retiro • Av. Ramón Castillo y Calle 12
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notifications, Staff Role & Avatar */}
        <div className="flex items-center gap-2">
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            aria-label="Notificaciones del centro"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors relative border border-slate-200"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <button
            id="btn-user-avatar"
            onClick={onOpenProfile}
            aria-label="Ver perfil profesional"
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-purple-200 hover:border-purple-400 bg-purple-50/50 transition-all focus:outline-none"
          >
            <div className="text-right hidden sm:block leading-tight">
              <span className="text-xs font-bold text-slate-800 block">
                {userName.split(' ')[0]}
              </span>
              <span className="text-[9px] text-purple-700 font-semibold block">
                Profesional CIM
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-purple-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-purple-300">
              {userPhotoURL ? (
                <img
                  src={userPhotoURL}
                  alt={userName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCheck className="w-4 h-4 text-white" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
