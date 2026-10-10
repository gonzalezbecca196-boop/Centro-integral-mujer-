import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Scale,
  Users,
  Stethoscope,
  Palette,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  User,
  Building2,
} from 'lucide-react';
import { Turno, LegajoCaso } from '../types';

interface SacarTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTurno: (newTurno: Turno) => void;
  initialService?: Turno['serviceType'];
  initialSede?: string;
  initialNotes?: string;
  initialNombre?: string;
  initialLegajoId?: string;
}

export const SacarTurnoModal: React.FC<SacarTurnoModalProps> = ({
  isOpen,
  onClose,
  onSaveTurno,
  initialService,
  initialSede,
  initialNotes,
  initialNombre,
  initialLegajoId,
}) => {
  const [step, setStep] = useState<number>(1);
  const [nombreUsuaria, setNombreUsuaria] = useState<string>(initialNombre || '');
  const [dniUsuaria, setDniUsuaria] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Turno['serviceType']>(
    initialService || 'psicologia'
  );
  const [selectedProfessional, setSelectedProfessional] = useState<string>('Lic. Laura Méndez');
  const [selectedLocation, setSelectedLocation] = useState<string>(
    'CIM Padre Carlos Mugica'
  );
  const [selectedConsultorio, setSelectedConsultorio] = useState<string>('Consultorio 2');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  const [urgency, setUrgency] = useState<'normal' | 'media' | 'alta'>('normal');
  const [notes, setNotes] = useState<string>(initialNotes || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialService) setSelectedService(initialService);
      if (initialSede) setSelectedLocation(initialSede);
      if (initialNotes !== undefined) setNotes(initialNotes);
      if (initialNombre) setNombreUsuaria(initialNombre);
      setStep(1);
      setIsSuccess(false);
    }
  }, [isOpen, initialService, initialSede, initialNotes, initialNombre]);

  if (!isOpen) return null;

  const services = [
    {
      id: 'psicologia' as Turno['serviceType'],
      label: 'Psicología y Salud Mental',
      description: 'Atención y seguimiento psicoterapéutico',
      icon: <Users className="w-5 h-5 text-purple-700" />,
      defaultProf: 'Lic. Laura Méndez',
      defaultRoom: 'Consultorio 2',
    },
    {
      id: 'legal' as Turno['serviceType'],
      label: 'Patrocinio Jurídico Gratuito',
      description: 'Medidas de protección y asesoría legal',
      icon: <Scale className="w-5 h-5 text-indigo-700" />,
      defaultProf: 'Dra. Romina Paz',
      defaultRoom: 'Box 1 - Legal',
    },
    {
      id: 'social' as Turno['serviceType'],
      label: 'Trabajo Social Comunitario',
      description: 'Subsidios, habitacional y contención social',
      icon: <Building2 className="w-5 h-5 text-emerald-700" />,
      defaultProf: 'Lic. Mariana Soto',
      defaultRoom: 'Box 2 - Social',
    },
    {
      id: 'talleres' as Turno['serviceType'],
      label: 'Talleres y Autonomía',
      description: 'Oficios, proyectos laborales y grupos',
      icon: <Palette className="w-5 h-5 text-pink-700" />,
      defaultProf: 'Coordinación de Talleres',
      defaultRoom: 'Aula 2 - Galpón Cultural',
    },
  ];

  const availableTimes = ['08:30', '09:30', '10:30', '11:45', '14:00', '15:30', '17:00'];

  const handleConfirm = () => {
    const serviceName =
      services.find((s) => s.id === selectedService)?.label || 'Consulta';

    const dateObj = new Date(selectedDate + 'T' + selectedTime + ':00');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = dayNames[dateObj.getDay()] || 'Hoy';

    const newTurno: Turno = {
      id: `turno-${Date.now()}`,
      legajoId: initialLegajoId,
      nombreUsuaria: nombreUsuaria.trim() || 'Usuaria Citada',
      dni: dniUsuaria.trim() || undefined,
      title: `${serviceName}`,
      serviceType: selectedService,
      dateLabel: `${dayOfWeek}, ${selectedTime}`,
      dateTimeIso: `${selectedDate}T${selectedTime}:00`,
      professional: selectedProfessional,
      location: selectedLocation,
      consultorio: selectedConsultorio,
      urgency,
      status: 'confirmado',
      notes: notes || 'Turno agendado por el equipo de coordinación administrativa.',
    };

    onSaveTurno(newTurno);
    setIsSuccess(true);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        id="modal-sacar-turno-container"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-purple-100 flex items-center justify-between bg-purple-900 text-white">
          <div className="flex items-center gap-2">
            {step > 1 && !isSuccess && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Asignación Administrativa de Turno
              </h3>
              <p className="text-[10px] text-purple-200">
                Paso {step} de 3 • Agenda CIM Mugica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  ¡Turno Asignado con Éxito!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Se programó la consulta para <strong>{nombreUsuaria || 'la usuaria'}</strong> con{' '}
                  <strong>{selectedProfessional}</strong>.
                </p>
                <p className="text-xs font-semibold text-purple-700 mt-1">
                  {selectedConsultorio} • {selectedLocation}
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
              >
                Volver a la Agenda
              </button>
            </div>
          ) : step === 1 ? (
            /* STEP 1: Usuaria y Disciplina */
            <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nombre Completo de la Usuaria *
                </label>
                <input
                  type="text"
                  required
                  value={nombreUsuaria}
                  onChange={(e) => setNombreUsuaria(e.target.value)}
                  placeholder="Ej: Luciana Morales"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  DNI (opcional)
                </label>
                <input
                  type="text"
                  value={dniUsuaria}
                  onChange={(e) => setDniUsuaria(e.target.value)}
                  placeholder="Ej: 38.412.980"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Seleccionar Disciplina o Servicio *
                </label>
                <div className="space-y-2">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv.id);
                        setSelectedProfessional(srv.defaultProf);
                        setSelectedConsultorio(srv.defaultRoom);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedService === srv.id
                          ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-xs">
                          {srv.icon}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {srv.label}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {srv.description}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedService === srv.id
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedService === srv.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={!nombreUsuaria.trim()}
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Siguiente: Fecha, Profesional y Sala</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : step === 2 ? (
            /* STEP 2: Profesional, Sala, Fecha y Hora */
            <div className="space-y-3 text-xs animate-in fade-in duration-150">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Profesional Responsable
                </label>
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  <option value="Lic. Laura Méndez">Lic. Laura Méndez (Psicología)</option>
                  <option value="Dra. Romina Paz">Dra. Romina Paz (Patrocinio Legal)</option>
                  <option value="Lic. Mariana Soto">Lic. Mariana Soto (Trabajo Social)</option>
                  <option value="Lic. Ana Martínez">Lic. Ana Martínez (Orientadora)</option>
                  <option value="Dra. Clara Fuentes">Dra. Clara Fuentes (Salud / Médica)</option>
                  <option value="Coordinación de Talleres">Coordinación de Talleres</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Sede de Atención</label>
                  <div className="w-full px-2.5 py-2 rounded-xl border border-purple-200 bg-purple-50/80 text-purple-900 font-bold text-xs truncate flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">CIM Padre Mugica</span>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Consultorio / Box</label>
                  <select
                    value={selectedConsultorio}
                    onChange={(e) => setSelectedConsultorio(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-xs"
                  >
                    <option value="Consultorio 1">Consultorio 1 (PB - Admisión)</option>
                    <option value="Consultorio 2">Consultorio 2 (PA - Salud Mental)</option>
                    <option value="Box Legal 1">Box Legal 1 (Patrocinio)</option>
                    <option value="Box Social 1">Box Social 1 (Trabajo Social)</option>
                    <option value="Sala de Reuniones">Sala de Talleres y Reunión</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nivel de Prioridad</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-xs"
                  >
                    <option value="normal">Normal / Programada</option>
                    <option value="media">Media / Seguimiento</option>
                    <option value="alta">🔴 Alta / Urgente (Cautelar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Horario Disponible</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedTime === time
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Siguiente: Notas y Confirmación</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* STEP 3: Notas y Resumen Final */
            <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block">
                  Resumen de la Consulta Programada
                </span>
                <div className="space-y-1">
                  <p><strong>Usuaria:</strong> {nombreUsuaria} {dniUsuaria && `(DNI ${dniUsuaria})`}</p>
                  <p><strong>Servicio:</strong> {services.find((s) => s.id === selectedService)?.label}</p>
                  <p><strong>Profesional:</strong> {selectedProfessional}</p>
                  <p><strong>Fecha y Hora:</strong> {selectedDate} a las {selectedTime} hs</p>
                  <p><strong>Lugar:</strong> {selectedConsultorio} • {selectedLocation}</p>
                  <p><strong>Prioridad:</strong> {urgency === 'alta' ? '🔴 Alta / Urgente' : 'Normal'}</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Notas de Citación o Motivo Específico
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Comparecencia por audiencia de perimetral. Traer certificado médico..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar Turno en Sistema</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
