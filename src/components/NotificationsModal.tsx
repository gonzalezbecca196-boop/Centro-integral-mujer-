import React from 'react';
import { X, Bell, Calendar, Sparkles, MessageSquare, CheckCircle2, Check, ArrowRight } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateAction: (action: 'agenda' | 'talleres' | 'chat') => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateAction,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-purple-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Notificaciones</h3>
              <p className="text-[10px] text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} ${unreadCount === 1 ? 'pendiente sin leer' : 'pendientes sin leer'}`
                  : 'Todas leídas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar notificaciones"
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center shadow-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-xs">No hay notificaciones en este momento.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                id={`notification-item-${n.id}`}
                onClick={() => {
                  // When tapped/touched, mark as read immediately so it ceases to be red
                  if (n.unread) {
                    onMarkAsRead(n.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  n.unread
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {n.unread ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        No leída
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        Leída
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {n.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                  {n.text}
                </p>

                {/* Optional action button */}
                {n.action && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(n.id);
                        if (n.action) {
                          onNavigateAction(n.action);
                          onClose();
                        }
                      }}
                      className="text-[10px] font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 group"
                    >
                      <span>
                        {n.action === 'agenda' && 'Ver en Agenda'}
                        {n.action === 'talleres' && 'Ver Talleres'}
                        {n.action === 'chat' && 'Abrir Chat'}
                      </span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {n.unread ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(n.id);
                        }}
                        className="text-[10px] text-slate-500 hover:text-purple-700 underline"
                      >
                        Marcar como leída
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-400">Revisada</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          {unreadCount > 0 ? (
            <button
              id="btn-mark-all-read"
              onClick={onMarkAllAsRead}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marcar todas como leídas</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
