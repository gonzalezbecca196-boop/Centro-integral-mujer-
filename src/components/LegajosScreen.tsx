import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  FileText,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Filter,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LegajoCaso, Turno } from '../types';

interface LegajosScreenProps {
  legajos: LegajoCaso[];
  onCreateLegajo: (newLegajo: LegajoCaso) => void;
  onUpdateLegajo: (id: string, updates: Partial<LegajoCaso>) => void;
  onScheduleTurnoForLegajo: (legajo: LegajoCaso) => void;
}

export const LegajosScreen: React.FC<LegajosScreenProps> = ({
  legajos,
  onCreateLegajo,
  onUpdateLegajo,
  onScheduleTurnoForLegajo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Click outside listener for legajos search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'todos' | 'alto' | 'medio' | 'bajo'>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'todos' | 'activo' | 'derivado' | 'cerrado'>('todos');
  const [selectedLegajo, setSelectedLegajo] = useState<LegajoCaso | null>(null);

  // Google-like predictive autocomplete for legajos
  const legajosSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const suggestions = new Set<string>();

    legajos.forEach((l) => {
      if (l.nombreUsuaria && l.nombreUsuaria.toLowerCase().includes(q)) {
        suggestions.add(l.nombreUsuaria);
      }
      if (l.numeroExpediente && l.numeroExpediente.toLowerCase().includes(q)) {
        suggestions.add(l.numeroExpediente);
      }
      if (l.sectorBarrio && l.sectorBarrio.toLowerCase().includes(q)) {
        suggestions.add(`Sector ${l.sectorBarrio}`);
      }
      if (l.dni && l.dni.includes(q)) {
        suggestions.add(`DNI ${l.dni}`);
      }
    });

    return Array.from(suggestions).slice(0, 4);
  }, [searchQuery, legajos]);

  const highlightMatch = (text: string, queryStr: string) => {
    if (!queryStr || !text) return text;
    try {
      const escaped = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === queryStr.toLowerCase() ? (
              <span key={i} className="font-extrabold text-indigo-900 bg-indigo-100 rounded px-0.5">
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

  // New Legajo Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formDni, setFormDni] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formEdad, setFormEdad] = useState('');
  const [formSector, setFormSector] = useState('Sector San Martín - Manzana 12');
  const [formRiesgo, setFormRiesgo] = useState<'alto' | 'medio' | 'bajo'>('alto');
  const [formDerivacion, setFormDerivacion] = useState('Demanda espontánea');
  const [formProfesional, setFormProfesional] = useState('Dra. Romina Paz (Legal) y Lic. Laura Méndez (Psic.)');
  const [formMotivo, setFormMotivo] = useState('');
  const [formMedidas, setFormMedidas] = useState('');
  const [formNotas, setFormNotas] = useState('');

  // Add Note Modal State inside Legajo Detail
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const filteredLegajos = legajos.filter((leg) => {
    const matchesSearch =
      leg.nombreUsuaria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.numeroExpediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.dni.includes(searchQuery) ||
      leg.sectorBarrio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRiskFilter === 'todos' || leg.riesgo === selectedRiskFilter;
    const matchesStatus = selectedStatusFilter === 'todos' || leg.estado === selectedStatusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formDni.trim()) return;

    const currentYear = new Date().getFullYear();
    const countNumber = legajos.length + 145;
    const expedienteNumber = `CIM-MUG-${currentYear}/${String(countNumber).padStart(4, '0')}`;

    const newLegajo: LegajoCaso = {
      id: `leg-${Date.now()}`,
      numeroExpediente: expedienteNumber,
      nombreUsuaria: formNombre.trim(),
      dni: formDni.trim(),
      telefono: formTelefono.trim() || 'No informado',
      edad: formEdad ? parseInt(formEdad, 10) : undefined,
      sectorBarrio: formSector,
      riesgo: formRiesgo,
      medidasProteccion: formMedidas
        ? formMedidas.split(',').map((m) => m.trim()).filter(Boolean)
        : [],
      estado: 'activo',
      profesionalAsignado: formProfesional,
      derivacionOrigen: formDerivacion,
      ultimaAtencion: 'Admisión reciente (Hoy)',
      motivoConsulta: formMotivo || 'Primera escucha y evaluación de riesgo.',
      notas: formNotas || 'Ingreso inicial registrado en sistema administrativo.',
      createdAt: new Date().toISOString(),
    };

    onCreateLegajo(newLegajo);
    setIsCreateModalOpen(false);
    // Reset form
    setFormNombre('');
    setFormDni('');
    setFormTelefono('');
    setFormEdad('');
    setFormMotivo('');
    setFormMedidas('');
    setFormNotas('');
  };

  const handleAddNoteToActiveLegajo = () => {
    if (!selectedLegajo || !newNoteText.trim()) return;
    const dateStamp = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const updatedNotes = `${selectedLegajo.notas}\n\n[${dateStamp} - Evolución]: ${newNoteText.trim()}`;
    onUpdateLegajo(selectedLegajo.id, {
      notas: updatedNotes,
      ultimaAtencion: 'Hoy',
    });
    setSelectedLegajo({
      ...selectedLegajo,
      notas: updatedNotes,
      ultimaAtencion: 'Hoy',
    });
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in duration-200">
      {/* Title & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Gestión de Casos • CIM Mugica
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Legajos y Expedientes
          </h2>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Admisión</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Legajos
          </span>
          <span className="text-lg font-black text-slate-900">{legajos.length}</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
            Alto Riesgo
          </span>
          <span className="text-lg font-black text-rose-700">
            {legajos.filter((l) => l.riesgo === 'alto').length}
          </span>
        </div>
        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            En Seguimiento
          </span>
          <span className="text-lg font-black text-emerald-700">
            {legajos.filter((l) => l.estado === 'activo').length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="relative flex items-center bg-white rounded-xl border border-slate-200 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 shadow-xs transition-all">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="legajos-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            onClick={() => setIsSearchDropdownOpen(true)}
            onFocus={() => setIsSearchDropdownOpen(true)}
            placeholder="Buscar por expediente, nombre, DNI o sector..."
            className="w-full py-2.5 pl-10 pr-8 bg-transparent text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center absolute right-9 text-xs"
              aria-label="Limpiar"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Dropdown Toggle Chevron */}
          <button
            type="button"
            onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
            className="p-1.5 mr-1 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            title={isSearchDropdownOpen ? 'Cerrar opciones' : 'Desplegar opciones de expedientes'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSearchDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Desplegable hacia abajo */}
        {isSearchDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-2 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider">
                Expedientes • CIM Mugica
              </span>
              <span className="text-[9px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.5 rounded">
                {legajos.length} registrados
              </span>
            </div>

            {!searchQuery.trim() ? (
              <div className="p-2 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 px-2 block uppercase tracking-wider">
                  Opciones de búsqueda y filtros rápidos
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRiskFilter('alto');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-rose-50 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-rose-800">Filtrar casos de Alto Riesgo</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                    {legajos.filter(l => l.riesgo === 'alto').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRiskFilter('medio');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-amber-50 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>Filtrar casos de Riesgo Medio</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {legajos.filter(l => l.riesgo === 'medio').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRiskFilter('todos');
                    setSelectedStatusFilter('todos');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-purple-50 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>Ver todos los expedientes</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    {legajos.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchDropdownOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-purple-50 text-purple-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Nuevo Expediente</span>
                </button>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {/* Google-like predictions for legajos */}
                {legajosSuggestions.length > 0 && (
                  <div className="pb-1 mb-1 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 px-2 block uppercase tracking-wider mb-1">
                      Sugerencias de expediente
                    </span>
                    {legajosSuggestions.map((sug, i) => (
                      <div
                        key={i}
                        onClick={() => setSearchQuery(sug)}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{highlightMatch(sug, searchQuery)}</span>
                        </div>
                        <span className="text-[10px] text-indigo-700 font-semibold">Completar</span>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[10px] font-bold text-indigo-700 px-2 block uppercase tracking-wider">
                  Expedientes encontrados ({filteredLegajos.length})
                </span>
                {filteredLegajos.length === 0 ? (
                  <p className="p-2 text-xs text-slate-500 text-center">
                    No hay expedientes con ese criterio en el registro.
                  </p>
                ) : (
                  filteredLegajos.slice(0, 5).map((leg) => (
                    <div
                      key={leg.id}
                      onClick={() => {
                        setSelectedLegajo(leg);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-purple-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                            {highlightMatch(leg.numeroExpediente, searchQuery)}
                          </span>
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {highlightMatch(leg.nombreUsuaria, searchQuery)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                          DNI: {highlightMatch(leg.dni, searchQuery)} • Sector: {highlightMatch(leg.sectorBarrio, searchQuery)}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          leg.riesgo === 'alto'
                            ? 'bg-rose-100 text-rose-800'
                            : leg.riesgo === 'medio'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {leg.riesgo}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="p-2 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between px-3">
              <span>Haz clic en un expediente para abrir su ficha</span>
              <button
                type="button"
                onClick={() => setIsSearchDropdownOpen(false)}
                className="font-bold text-purple-700 hover:underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => setSelectedRiskFilter('todos')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            selectedRiskFilter === 'todos'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Todos ({legajos.length})
        </button>
        <button
          onClick={() => setSelectedRiskFilter('alto')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            selectedRiskFilter === 'alto'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Alto Riesgo ({legajos.filter((l) => l.riesgo === 'alto').length})</span>
        </button>
        <button
          onClick={() => setSelectedRiskFilter('medio')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            selectedRiskFilter === 'medio'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Medio ({legajos.filter((l) => l.riesgo === 'medio').length})</span>
        </button>
        <button
          onClick={() => setSelectedRiskFilter('bajo')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            selectedRiskFilter === 'bajo'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Bajo ({legajos.filter((l) => l.riesgo === 'bajo').length})</span>
        </button>
      </div>

      {/* Legajos List */}
      <div className="space-y-2.5">
        {filteredLegajos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-xs text-slate-700">No se encontraron expedientes</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prueba modificando los filtros de búsqueda o riesgo.
            </p>
          </div>
        ) : (
          filteredLegajos.map((legajo) => (
            <div
              key={legajo.id}
              onClick={() => setSelectedLegajo(legajo)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {legajo.numeroExpediente}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        legajo.riesgo === 'alto'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : legajo.riesgo === 'medio'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      Riesgo {legajo.riesgo}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {legajo.nombreUsuaria}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    DNI {legajo.dni} • {legajo.sectorBarrio}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                    {legajo.derivacionOrigen}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center text-slate-400 group-hover:text-purple-700 mt-2 ml-auto transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Protective Measures Badges */}
              {legajo.medidasProteccion.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {legajo.medidasProteccion.map((med, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-md"
                    >
                      🛡️ {med}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer row */}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Atendido por: <strong>{legajo.profesionalAsignado}</strong></span>
                <span>Último contacto: {legajo.ultimaAtencion}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL MODAL FOR A LEGAJO */}
      {selectedLegajo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                    {selectedLegajo.numeroExpediente}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      selectedLegajo.riesgo === 'alto'
                        ? 'bg-rose-500 text-white'
                        : selectedLegajo.riesgo === 'medio'
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    Riesgo {selectedLegajo.riesgo}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-white mt-1">
                  {selectedLegajo.nombreUsuaria}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedLegajo(null);
                  setIsAddingNote(false);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
              {/* Personal Data Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">DNI</span>
                  <span className="font-bold text-slate-800">{selectedLegajo.dni}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Teléfono de Contacto</span>
                  <span className="font-bold text-slate-800">{selectedLegajo.telefono}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Sector Barrio Mugica</span>
                  <span className="font-bold text-slate-800">{selectedLegajo.sectorBarrio}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Vía de Derivación</span>
                  <span className="font-bold text-purple-700">{selectedLegajo.derivacionOrigen}</span>
                </div>
              </div>

              {/* Protective Measures */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Medidas de Protección y Cautelares</span>
                </h4>
                {selectedLegajo.medidasProteccion.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                    Sin medidas cautelares activas registradas al momento.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {selectedLegajo.medidasProteccion.map((medida, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold text-xs flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{medida}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Professional Assignment */}
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  Equipo Interdisciplinario Asignado
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {selectedLegajo.profesionalAsignado}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Motivo de consulta:</strong> {selectedLegajo.motivoConsulta}
                </p>
              </div>

              {/* Clinical & Case Evolution Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-700" />
                    <span>Registro de Evolución Confidencial</span>
                  </h4>
                  <button
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline"
                  >
                    {isAddingNote ? 'Cancelar nota' : '+ Agregar nota de consulta'}
                  </button>
                </div>

                {isAddingNote && (
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 mb-2 animate-in fade-in duration-150">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Escribí aquí las notas de la consulta, intervención o avance judicial..."
                      rows={3}
                      className="w-full p-2.5 rounded-xl bg-white border border-purple-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      onClick={handleAddNoteToActiveLegajo}
                      className="w-full py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                    >
                      Guardar nota en expediente
                    </button>
                  </div>
                )}

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-700 text-xs max-h-48 overflow-y-auto">
                  {selectedLegajo.notas || 'Sin notas adicionales.'}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onScheduleTurnoForLegajo(selectedLegajo);
                  setSelectedLegajo(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Asignar Turno a esta Usuaria</span>
              </button>

              <button
                onClick={() => setSelectedLegajo(null)}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW LEGAJO MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm">Apertura de Nuevo Legajo CIM</h3>
                <p className="text-[11px] text-purple-200">
                  Ficha de primera escucha y admisión institucional
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo de la Usuaria *</label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: Luciana Morales"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DNI *</label>
                  <input
                    type="text"
                    required
                    value={formDni}
                    onChange={(e) => setFormDni(e.target.value)}
                    placeholder="Ej: 38.412.980"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="Ej: 11-4567-8901"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sector Barrio Mugica</label>
                  <input
                    type="text"
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel de Riesgo Inicial</label>
                  <select
                    value={formRiesgo}
                    onChange={(e) => setFormRiesgo(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                  >
                    <option value="alto">🔴 Alto Riesgo / Urgencia</option>
                    <option value="medio">🟡 Riesgo Medio</option>
                    <option value="bajo">🟢 Riesgo Bajo / Seguimiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vía de Derivación</label>
                <select
                  value={formDerivacion}
                  onChange={(e) => setFormDerivacion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  <option value="Demanda espontánea">Demanda espontánea (se acercó al centro)</option>
                  <option value="Línea 144 / Guardia nocturna">Línea 144 / Guardia nocturna</option>
                  <option value="Oficina de Violencia Doméstica (OVD)">Oficina de Violencia Doméstica (OVD)</option>
                  <option value="CeSAC N° 25 (Salud)">CeSAC N° 25 (Centro de Salud Retiro)</option>
                  <option value="Comisaría Comunal 1 (Retiro)">Comisaría Comunal 1 (Retiro)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Medidas Cautelares (separadas por coma)</label>
                <input
                  type="text"
                  value={formMedidas}
                  onChange={(e) => setFormMedidas(e.target.value)}
                  placeholder="Ej: Botón antipánico, Perimetral 500m, Exclusión de hogar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo de Consulta y Primera Escucha</label>
                <textarea
                  rows={2}
                  value={formMotivo}
                  onChange={(e) => setFormMotivo(e.target.value)}
                  placeholder="Describí brevemente la situación manifestada..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-xs"
                >
                  Crear y Guardar Legajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
