import React from 'react';
import {
  Home,
  Calendar,
  MessageSquare,
  User,
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
  pendingReportsCount?: number;
  onOpenRutasModal?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadChatCount = 1,
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Barra de navegación principal"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-2 shadow-md"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
        {/* Tab 1: Inicio */}
        <button
          id="nav-tab-inicio"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'dashboard'
              ? 'text-purple-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'dashboard'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Inicio</span>
        </button>

        {/* Tab 2: Agenda */}
        <button
          id="nav-tab-agenda"
          onClick={() => onSelectTab('agenda')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'agenda'
              ? 'text-purple-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'agenda'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Agenda</span>
        </button>

        {/* Tab 3: Chat */}
        <button
          id="nav-tab-chat"
          onClick={() => onSelectTab('chat')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            currentTab === 'chat'
              ? 'text-purple-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'chat'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </div>
          {unreadChatCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Chat</span>
        </button>

        {/* Tab 4: Perfil */}
        <button
          id="nav-tab-perfil"
          onClick={() => onSelectTab('perfil')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            currentTab === 'perfil'
              ? 'text-purple-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'perfil'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-transparent text-slate-500'
            }`}
          >
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
