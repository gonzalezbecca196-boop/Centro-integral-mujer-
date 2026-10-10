export type TabType =
  | 'dashboard'
  | 'agenda'
  | 'legajos'
  | 'senderos'
  | 'avisos'
  | 'chat'
  | 'perfil';

export interface Turno {
  id: string;
  legajoId?: string;
  nombreUsuaria?: string;
  dni?: string;
  title: string;
  serviceType: 'psicologia' | 'legal' | 'social' | 'medica' | 'talleres';
  dateLabel: string; // e.g. "Hoy, 10:30 AM", "Miércoles, 4:00 PM"
  dateTimeIso: string;
  professional?: string;
  location: string;
  consultorio?: string;
  urgency?: 'alta' | 'media' | 'normal';
  status: 'confirmado' | 'pendiente' | 'completado' | 'cancelado' | 'en_atencion';
  notes?: string;
}

export interface LegajoCaso {
  id: string;
  numeroExpediente: string;
  nombreUsuaria: string;
  dni: string;
  telefono: string;
  edad?: number;
  sectorBarrio: string;
  riesgo: 'alto' | 'medio' | 'bajo';
  medidasProteccion: string[];
  estado: 'activo' | 'derivado' | 'cerrado' | 'en_espera';
  profesionalAsignado: string;
  derivacionOrigen: string;
  ultimaAtencion: string;
  motivoConsulta: string;
  notas: string;
  createdAt: string;
}

export interface SenderoReport {
  id: string;
  senderoId: string;
  senderoName: string;
  puntoAfectado: string;
  tipoProblema: 'luminaria' | 'totem' | 'camara' | 'obstruccion' | 'acompanamiento';
  descripcion: string;
  estado: 'pendiente' | 'en_reparacion' | 'resuelto';
  fechaReporte: string;
  promotoraAsignada?: string;
  reportadoPor?: string;
}

export interface Aviso {
  id: string;
  tag: string;
  tagType: 'nuevo' | 'recordatorio' | 'salud';
  title: string;
  description: string;
  date: string;
  actionText?: string;
  cupoMaximo?: number;
  inscriptasCount?: number;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarLetter: string;
  avatarColor: string;
  photo?: string;
  area?: 'Psicosocial' | 'Legal' | 'Social' | 'Guardia 144' | 'Coordinación';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  action?: 'agenda' | 'talleres' | 'chat';
}

export interface CenterLocation {
  id: string;
  name: string;
  address: string;
  barrio: string;
  hours: string;
  phone: string;
  services: string[];
  isMain?: boolean;
  equiposDisponibles?: string[];
  guardiaActiva?: boolean;
}

export interface SenderoCheckpoint {
  id: string;
  name: string;
  type: 'totem' | 'camara' | 'comercio' | 'posta' | 'transporte' | 'salud';
  description: string;
}

export interface SenderoRoute {
  id: string;
  name: string;
  destination: string;
  origin: string;
  distance: string;
  walkingTime: string;
  status: 'activo' | 'precaucion' | 'mantenimiento';
  statusText: string;
  lighting: string;
  safetyScore: number;
  checkpoints: SenderoCheckpoint[];
  description: string;
  recommendedHours: string;
  promotorasAsignadas?: string[];
  reportesPendientes?: number;
}
