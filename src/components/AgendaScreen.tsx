import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Heart,
  Users,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Check,
  Building2,
  PhoneCall,
  User,
  X,
} from 'lucide-react';
import { Turno } from '../types';

interface AgendaScreenProps {
  turnos: Turno[];
  onOpenSacarTurno: () => void;
  onCancelTurno: (id: string) => void;
  onCompleteTurno: (id: string) => void;
  onSelectTurnoDetails: (turno: Turno) => void;
  onUpdateTurnoStatus?: (id: string, status: Turno['status'], consultorio?: string) => void;
  initialFilter?: string;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({
  turnos,
  onOpenSacarTurno,
  onCancelTurno,
  onCompleteTurno,
  onSelectTurnoDetails,
  onUpdateTurnoStatus,
  initialFilter = 'todos',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [viewMode, setViewMode] = useState<'lista' | 'calendario'>('lista');
  const [activeMenuTurnoId, setActiveMenuTurnoId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilter) {
      setSelectedFilter(initialFilter);
    }
  }, [initialFilter]);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(9); // 9 = October (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Compute days with scheduled turnos in the current calendar view
  const daysWithTurnos = new Set(
    turnos
      .map((t) => {
        const d = new Date(t.dateTimeIso);
        if (
          !isNaN(d.getTime()) &&
          d.getMonth() === calendarMonth &&
          d.getFullYear() === calendarYear
        ) {
          return d.getDate();
        }
        return null;
      })
      .filter((day): day is number => day !== null)
  );

  const filteredTurnos = turnos.filter((turno) => {
    const matchesSearch =
      !searchQuery.trim() ||
      (turno.nombreUsuaria && turno.nombreUsuaria.toLowerCase().includes(searchQuery.toLowerCase())) ||
      turno.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turno.dateLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (turno.professional && turno.professional.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (turno.consultorio && turno.consultorio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === 'todos' || turno.serviceType === selectedFilter;

    let matchesDay = true;
    if (viewMode === 'calendario' && selectedCalendarDay !== null) {
      const d = new Date(turno.dateTimeIso);
      if (!isNaN(d.getTime())) {
        matchesDay =
          d.getDate() === selectedCalendarDay &&
          d.getMonth() === calendarMonth &&
          d.getFullYear() === calendarYear;
      }
    }

    return matchesSearch && matchesFilter && matchesDay;
  });

  const getServiceBadge = (type: Turno['serviceType']) => {
    switch (type) {
      case 'psicologia':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Psicología</span>;
      case 'legal':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Legal</span>;
      case 'social':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Trabajo Social</span>;
      case 'talleres':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-800">Talleres</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">Atención</span>;
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 animate-in fade-in duration-200">
      {/* Title & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Gestión de Consultas • CIM Mugica
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Agenda Operativa
          </h2>
        </div>

        <button
          onClick={onOpenSacarTurno}
          className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Asignar Turno</span>
        </button>
      </div>

      {/* Search Input & View Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="relative flex items-center bg-white rounded-xl border border-slate-200 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 shadow-xs transition-all">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="agenda-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuaria, profesional, consultorio..."
              className="w-full py-2 pl-9 pr-8 bg-transparent text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center absolute right-2 text-xs"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'lista'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('calendario')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'calendario'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Filter by Discipline Pills with Clear/Toggle option */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'todos', label: 'Todas las Disciplinas' },
          { id: 'psicologia', label: 'Psicología' },
          { id: 'legal', label: 'Patrocinio Legal' },
          { id: 'social', label: 'Trabajo Social' },
          { id: 'talleres', label: 'Talleres' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(selectedFilter === f.id ? 'todos' : f.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedFilter === f.id
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
            }`}
          >
            {f.label}
          </button>
        ))}
        {selectedFilter !== 'todos' && (
          <button
            onClick={() => setSelectedFilter('todos')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 transition-colors shrink-0 border border-purple-200"
            title="Quitar filtro de disciplina"
          >
            <X className="w-3.5 h-3.5" />
            <span>Quitar filtro</span>
          </button>
        )}
      </div>

      {/* Interactive Calendar Month View (when toggled) */}
      {viewMode === 'calendario' && (
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              {monthNames[calendarMonth]} {calendarYear}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setCalendarMonth((prev) => (prev === 0 ? 11 : prev - 1))
                }
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 flex items-center justify-center text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCalendarMonth((prev) => (prev === 11 ? 0 : prev + 1))
                }
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 flex items-center justify-center text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
            <span>D</span>
            <span>L</span>
            <span>M</span>
            <span>M</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasTurno = daysWithTurnos.has(day);
              const isSelected = selectedCalendarDay === day;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() =>
                    setSelectedCalendarDay(isSelected ? null : day)
                  }
                  className={`h-8 rounded-xl flex flex-col items-center justify-center text-xs font-semibold relative transition-all ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : hasTurno
                      ? 'bg-purple-50 text-purple-900 font-bold hover:bg-purple-100'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  {hasTurno && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                        isSelected ? 'bg-amber-300' : 'bg-purple-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Días con actividad programada
            </span>
            {selectedCalendarDay ? (
              <button
                onClick={() => setSelectedCalendarDay(null)}
                className="font-semibold text-purple-700 hover:underline"
              >
                Día {selectedCalendarDay} (limpiar filtro)
              </button>
            ) : (
              <span className="text-slate-400">Tocá un día para filtrar</span>
            )}
          </div>
        </div>
      )}

      {/* Turnos Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Consultas Programadas ({filteredTurnos.length})
          </h3>
          <span className="text-[11px] text-purple-700 font-semibold">Guardia CIM Mugica</span>
        </div>

        {filteredTurnos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2 text-slate-500">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-xs text-slate-700">No hay turnos registrados</p>
            <p className="text-[11px] text-slate-400">
              Probá modificando los filtros de búsqueda o asigná un nuevo turno.
            </p>
            <button
              onClick={onOpenSacarTurno}
              className="mt-2 px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold"
            >
              + Asignar Turno
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTurnos.map((turno) => (
              <div
                key={turno.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col gap-2 relative group"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getServiceBadge(turno.serviceType)}
                      <span className="text-[10px] font-semibold text-slate-500">
                        {turno.dateLabel}
                      </span>
                      {turno.urgency === 'alta' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-black uppercase">
                          Urgente
                        </span>
                      )}
                    </div>
                    <h4
                      onClick={() => onSelectTurnoDetails(turno)}
                      className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug cursor-pointer hover:text-purple-700"
                    >
                      {turno.nombreUsuaria || turno.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <strong>Motivo:</strong> {turno.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        turno.status === 'en_atencion'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : turno.status === 'completado'
                          ? 'bg-slate-100 text-slate-600'
                          : turno.status === 'cancelado'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {turno.status === 'en_atencion' && 'En Sala'}
                      {turno.status === 'completado' && 'Atendido'}
                      {turno.status === 'cancelado' && 'Cancelado'}
                      {turno.status === 'confirmado' && 'Confirmado'}
                      {turno.status === 'pendiente' && 'Pendiente'}
                    </span>
                  </div>
                </div>

                {/* Professional & Room row */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-700" />
                    <span>{turno.professional || 'Equipo de Guardia'}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{turno.consultorio || turno.location}</span>
                  </div>
                </div>

                {/* Administrative Quick Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                  <button
                    onClick={() => onSelectTurnoDetails(turno)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline"
                  >
                    Ver detalles y notas
                  </button>

                  <div className="flex items-center gap-1.5">
                    {turno.status !== 'en_atencion' && turno.status !== 'completado' && onUpdateTurnoStatus && (
                      <button
                        onClick={() => onUpdateTurnoStatus(turno.id, 'en_atencion')}
                        className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Llamar a Sala</span>
                      </button>
                    )}

                    {turno.status !== 'completado' && (
                      <button
                        onClick={() => onCompleteTurno(turno.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Marcar Atendido</span>
                      </button>
                    )}

                    <button
                      onClick={() => onCancelTurno(turno.id)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[11px] font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
