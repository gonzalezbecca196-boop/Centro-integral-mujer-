import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  CalendarPlus,
  Building2,
  ShieldAlert,
  MessageSquare,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Clock,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Aviso, Turno } from '../types';

interface HomeScreenProps {
  userName?: string;
  avisos: Aviso[];
  upcomingTurnos: Turno[];
  onOpenSacarTurno: () => void;
  onOpenCentros: () => void;
  onOpenEmergency: () => void;
  onGoToAgenda: () => void;
  onGoToChat?: () => void;
  onSelectAviso: (aviso: Aviso) => void;
  onSelectTurno: (turno: Turno) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'Equipo Profesional',
  avisos,
  upcomingTurnos,
  onOpenSacarTurno,
  onOpenCentros,
  onOpenEmergency,
  onGoToAgenda,
  onGoToChat,
  onSelectAviso,
  onSelectTurno,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<'todas' | 'turnos' | 'consultorios'>('todas');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown cleanly when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const pendingTurnos = upcomingTurnos.filter(
    (t) => t.status === 'confirmado' || t.status === 'pendiente' || t.status === 'en_atencion'
  );

  const consultoriosSede = [
    { id: 'c1', name: 'Consultorio 1 (PB)', rol: 'Admisión y Primera Escucha Interdisciplinaria', planta: 'Planta Baja' },
    { id: 'c2', name: 'Consultorio 2 (PA)', rol: 'Psicoterapia Individual y Salud Mental', planta: 'Planta Alta' },
    { id: 'bl1', name: 'Box Legal 1 (PA)', rol: 'Patrocinio Jurídico y Medidas Cautelares', planta: 'Planta Alta' },
    { id: 'bs1', name: 'Box Social 1 (PB)', rol: 'Trabajo Social y Gestión Habitacional', planta: 'Planta Baja' },
    { id: 'st1', name: 'Sala de Talleres y Reunión (PB)', rol: 'Grupos Terapéuticos y Autonomía', planta: 'Planta Baja' },
  ];

  const query = searchQuery.trim().toLowerCase();

  const filteredSearchTurnos = upcomingTurnos.filter(
    (t) =>
      query &&
      ((t.nombreUsuaria && t.nombreUsuaria.toLowerCase().includes(query)) ||
        t.title.toLowerCase().includes(query) ||
        (t.professional && t.professional.toLowerCase().includes(query)) ||
        (t.consultorio && t.consultorio.toLowerCase().includes(query)) ||
        (t.dni && t.dni.includes(query)))
  );

  const filteredSearchConsultorios = consultoriosSede.filter(
    (c) =>
      query &&
      (c.name.toLowerCase().includes(query) ||
        c.rol.toLowerCase().includes(query) ||
        c.planta.toLowerCase().includes(query))
  );

  const totalResultsCount = filteredSearchTurnos.length + filteredSearchConsultorios.length;

  const highlightMatch = (text: string, queryStr: string) => {
    if (!queryStr || !text) return text;
    try {
      const escaped = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === queryStr.toLowerCase() ? (
              <span key={i} className="font-black text-purple-900 bg-purple-200/90 rounded px-0.5">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 animate-in fade-in duration-200">
      {/* Administrative Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                Guardia Interdisciplinaria
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              CIM Padre Mugica
            </h2>
            <p className="text-xs text-purple-200/90 mt-0.5">
              Centro Integral de la Mujer • Av. Ramón Castillo y Calle 12
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-xl text-white font-bold block border border-white/20">
              {new Date().toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[9px] text-purple-300 font-bold block mt-1">Retiro - B° 31</span>
          </div>
        </div>
      </div>

      {/* Clean Administrative Search Bar */}
      <div ref={searchContainerRef} className="relative z-30">
        <div
          className={`flex items-center bg-white rounded-2xl border transition-all px-3 py-2 ${
            isSearchOpen
              ? 'border-purple-600 shadow-md ring-2 ring-purple-600/10'
              : 'border-slate-200 hover:border-purple-300 shadow-xs'
          }`}
        >
          <Search className="w-4 h-4 text-purple-700 shrink-0 mr-2" />
          <input
            ref={searchInputRef}
            id="home-admin-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onClick={() => setIsSearchOpen(true)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Buscar usuaria, DNI, profesional o consultorio..."
            className="w-full text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none bg-transparent"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                if (searchInputRef.current) searchInputRef.current.focus();
              }}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mr-1 text-xs transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 text-slate-400 hover:text-purple-700 rounded-lg transition-colors shrink-0"
            title={isSearchOpen ? 'Cerrar búsqueda' : 'Desplegar'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSearchOpen ? 'rotate-180 text-purple-700' : ''}`} />
          </button>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <div
            id="home-search-dropdown-menu"
            className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-[380px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {/* Category Filter Pills */}
            <div className="p-2.5 bg-slate-50 flex items-center gap-1.5 overflow-x-auto border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSearchCategory('todas')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  searchCategory === 'todas'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                Todas {query && `(${totalResultsCount})`}
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('turnos')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  searchCategory === 'turnos'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                Turnos {query && `(${filteredSearchTurnos.length})`}
              </button>
              <button
                type="button"
                onClick={() => setSearchCategory('consultorios')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  searchCategory === 'consultorios'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                Consultorios {query && `(${filteredSearchConsultorios.length})`}
              </button>
            </div>

            {/* Results Content */}
            <div className="p-3 space-y-3">
              {!query ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Búsqueda rápida en el sistema administrativo</p>
                  <p className="text-[11px] text-slate-400 mt-1">Escribí un nombre de usuaria, profesional o consultorio.</p>
                </div>
              ) : totalResultsCount === 0 ? (
                <div className="text-center py-5 text-xs text-slate-500">
                  <p className="font-bold text-slate-700">Sin resultados para "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">Verificá el criterio de búsqueda o revisá la agenda completa.</p>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onGoToAgenda();
                    }}
                    className="mt-2.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Ir a Agenda completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Matching Turnos */}
                  {(searchCategory === 'todas' || searchCategory === 'turnos') && filteredSearchTurnos.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          Turnos ({filteredSearchTurnos.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {filteredSearchTurnos.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              onSelectTurno(t);
                            }}
                            className="p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-100/70 border border-purple-100 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="font-bold text-xs text-slate-900">
                                {highlightMatch(t.nombreUsuaria || t.title, query)}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {t.dateLabel} • {highlightMatch(t.consultorio || t.location, query)} • {highlightMatch(t.professional || '', query)}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                              Ver turno →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Consultorios */}
                  {(searchCategory === 'todas' || searchCategory === 'consultorios') && filteredSearchConsultorios.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-purple-600" />
                          Consultorios ({filteredSearchConsultorios.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {filteredSearchConsultorios.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              onOpenCentros();
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="font-bold text-xs text-slate-900">
                                {highlightMatch(c.name, query)}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {highlightMatch(c.rol, query)} • {c.planta}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                              Ver salas →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-2 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guardia de Turnos del Día (Administrative Appointment Queue) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Turnos en Guardia Hoy
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              {pendingTurnos.length} programados
            </span>
          </div>

          <button
            onClick={onGoToAgenda}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Ver toda la agenda</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {pendingTurnos.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No hay turnos pendientes para la guardia actual.
            </div>
          ) : (
            pendingTurnos.slice(0, 3).map((turno) => (
              <div
                key={turno.id}
                onClick={() => onSelectTurno(turno)}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      turno.serviceType === 'psicologia'
                        ? 'bg-purple-100 text-purple-700'
                        : turno.serviceType === 'legal'
                        ? 'bg-indigo-100 text-indigo-700'
                        : turno.serviceType === 'social'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {turno.serviceType === 'psicologia' && 'PSI'}
                    {turno.serviceType === 'legal' && 'LEG'}
                    {turno.serviceType === 'social' && 'SOC'}
                    {turno.serviceType === 'talleres' && 'TAL'}
                    {turno.serviceType === 'medica' && 'MED'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {turno.nombreUsuaria || turno.title}
                      </h4>
                      {turno.urgency === 'alta' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                          Urgente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {turno.dateLabel} • {turno.consultorio || turno.location}
                    </p>
                    <p className="text-[10px] text-purple-700 font-medium">
                      Atiende: {turno.professional || 'Equipo de Guardia'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      turno.status === 'en_atencion'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {turno.status === 'en_atencion' ? 'En Sala' : 'Confirmado'}
                  </span>
                  <div className="text-[10px] text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform mt-1 flex items-center justify-end gap-0.5">
                    <span>Gestionar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Novedades y Avisos Institucionales del CIM */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Convocatorias y Talleres Oficiales
          </h3>
          <span className="text-[11px] text-purple-700 font-semibold">CIM Mugica</span>
        </div>

        <div className="space-y-2">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              onClick={() => onSelectAviso(aviso)}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-colors"
            >
              <div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 inline-block mb-1">
                  {aviso.tag} • {aviso.date}
                </span>
                <h4 className="font-bold text-slate-900 text-xs">{aviso.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {aviso.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-purple-700 font-bold block">
                  {aviso.inscriptasCount || 0} / {aviso.cupoMaximo || 25} cupos
                </span>
                <span className="text-[10px] text-slate-400 underline">Gestionar</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
