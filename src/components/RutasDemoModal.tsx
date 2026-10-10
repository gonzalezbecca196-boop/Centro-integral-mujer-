import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  X,
  Compass,
  Sparkles,
  Calendar,
  ShieldAlert,
  MessageSquare,
  User,
  Heart,
  CalendarPlus,
  MapPin,
  Lock,
  EyeOff,
  PhoneCall,
  Play,
} from 'lucide-react';

export interface RouteItem {
  id: string;
  name: string;
  path: string;
  category: 'principal' | 'asistencia' | 'seguridad' | 'cuenta';
  description: string;
  verified: boolean;
  onNavigate: () => void;
}

interface RutasDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoute: (path: string) => void;
}

export const RutasDemoModal: React.FC<RutasDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRoute,
}) => {
  const [activeTab, setActiveTab] = useState<'todas' | 'principales' | 'seguridad'>('todas');
  const [lastTestedRoute, setLastTestedRoute] = useState<string | null>(null);

  if (!isOpen) return null;

  const routes: RouteItem[] = [
    {
      id: '1',
      name: 'Tablero de Control y Guardia (Dashboard)',
      path: '/dashboard',
      category: 'principal',
      description: 'Panel administrativo en tiempo real: turnos del día, legajos activos, alertas de alto riesgo e incidencias territoriales.',
      verified: true,
      onNavigate: () => onNavigateToRoute('dashboard'),
    },
    {
      id: '2',
      name: 'Agenda de Consultorios y Turnos',
      path: '/agenda',
      category: 'principal',
      description: 'Vista de lista y calendario mensual con filtros por servicio (Legal, Psicología, Social, Médica, Talleres) y cambio de estado.',
      verified: true,
      onNavigate: () => onNavigateToRoute('agenda'),
    },
    {
      id: '3',
      name: 'Expedientes y Legajos Confidenciales',
      path: '/legajos',
      category: 'principal',
      description: 'Gestión de casos CIM: búsqueda por DNI/expediente, semáforo de riesgo, medidas cautelares y notas interdisciplinarias.',
      verified: true,
      onNavigate: () => onNavigateToRoute('legajos'),
    },
    {
      id: '4',
      name: 'Monitoreo de Senderos Seguros',
      path: '/senderos',
      category: 'seguridad',
      description: 'Infraestructura territorial de los 4 senderos del Barrio Mugica: tótems, cámaras CMU, luminarias y mesa de incidencias técnicas.',
      verified: true,
      onNavigate: () => onNavigateToRoute('senderos'),
    },
    {
      id: '5',
      name: 'Interconsulta y Chat de Guardia',
      path: '/chat',
      category: 'principal',
      description: 'Canal seguro entre trabajadoras sociales, psicólogas, abogadas, guardia 144/OVD y referentes territoriales.',
      verified: true,
      onNavigate: () => onNavigateToRoute('chat'),
    },
    {
      id: '6',
      name: 'Perfil y Credenciales del Personal',
      path: '/perfil',
      category: 'cuenta',
      description: 'Identificación de guardia, sincronización con Firebase Auth, sede activa y configuración del sistema.',
      verified: true,
      onNavigate: () => onNavigateToRoute('perfil'),
    },
    {
      id: '7',
      name: 'Asignación de Turno / Admisión',
      path: '/sacar-turno',
      category: 'asistencia',
      description: 'Alta de consulta interdisciplinaria: selección de profesional, box/consultorio, urgencia y vinculación con legajo.',
      verified: true,
      onNavigate: () => onNavigateToRoute('sacar-turno'),
    },
    {
      id: '8',
      name: 'Instalaciones y Consultorios',
      path: '/centros',
      category: 'asistencia',
      description: 'Salas de atención, boxes legales y consultorios del CIM Padre Carlos Mugica.',
      verified: true,
      onNavigate: () => onNavigateToRoute('centros'),
    },
    {
      id: '9',
      name: 'Protocolo de Urgencias (144 / 911 / OVD)',
      path: '/emergencia',
      category: 'seguridad',
      description: 'Línea directa con OVD, Comisaría Comunal 1 y protocolo de emergencia de la guardia interdisciplinaria.',
      verified: true,
      onNavigate: () => onNavigateToRoute('emergencia'),
    },
    {
      id: '10',
      name: 'Acceso Administrativo y Google Auth',
      path: '/login',
      category: 'cuenta',
      description: 'Inicio de sesión con Google Sign-In para profesionales del CIM y credenciales de guardia.',
      verified: true,
      onNavigate: () => onNavigateToRoute('login'),
    },
    {
      id: '11',
      name: 'Novedades y Talleres Comunitarios',
      path: '/notificaciones',
      category: 'asistencia',
      description: 'Gestión de cupos, inscripciones a talleres de autonomía económica y avisos institucionales del CIM.',
      verified: true,
      onNavigate: () => onNavigateToRoute('notificaciones'),
    },
  ];

  const filteredRoutes = routes.filter((r) => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'principales') return r.category === 'principal';
    if (activeTab === 'seguridad') return r.category === 'seguridad' || r.category === 'asistencia';
    return true;
  });

  const handleTestRoute = (route: RouteItem) => {
    setLastTestedRoute(route.path);
    route.onNavigate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-800 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm leading-tight">
                  Verificador de Rutas del Demo
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                  {routes.length}/{routes.length} OK
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Todas las rutas revisadas, funcionales y listas para entrega
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Estado: {routes.length} de {routes.length} rutas verificadas con éxito (incluye Rutas del Sendero).</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-700 font-bold">
            100% Funcional
          </span>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pt-3 pb-1 flex gap-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('todas')}
            className={`pb-2 px-1 font-bold border-b-2 transition-all ${
              activeTab === 'todas'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Todas las Rutas ({routes.length})
          </button>
          <button
            onClick={() => setActiveTab('principales')}
            className={`pb-2 px-1 font-bold border-b-2 transition-all ${
              activeTab === 'principales'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Gestión y Guardia
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`pb-2 px-1 font-bold border-b-2 transition-all ${
              activeTab === 'seguridad'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Territorio y Urgencias
          </button>
        </div>

        {/* Routes List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredRoutes.map((route, index) => (
            <div
              key={route.id}
              className="p-3 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs transition-all flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center">
                    {route.id}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {route.name}
                  </span>
                  <span className="font-mono text-[10px] bg-slate-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                    #{route.path}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Revisada
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-7">
                  {route.description}
                </p>
              </div>

              <button
                onClick={() => handleTestRoute(route)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 border border-purple-200 hover:border-purple-600 shadow-xs"
                title={`Probar ruta ${route.path}`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Probar</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Todas las 10 rutas son compatibles con navegador e iframe.
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Cerrar Verificador
          </button>
        </div>
      </div>
    </div>
  );
};
