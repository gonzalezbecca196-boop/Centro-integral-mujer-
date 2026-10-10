import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  HelpCircle,
  FileText,
  Phone,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Key,
  Compass,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Footprints,
  Navigation,
  Radio,
} from 'lucide-react';
import { Turno, SenderoRoute } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import {
  subscribeToSafetyPlan,
  saveSafetyPlanToFirestore,
} from '../firebase';
import { SENDEROS_DATA } from '../data/mockData';

interface HerramientasScreenProps {
  currentUser?: FirebaseUser | null;
  onOpenSacarTurno: () => void;
  onOpenEmergency: () => void;
  onTriggerCamouflage?: () => void;
  onOpenSenderoModal?: (senderoId?: string) => void;
}

type ToolSubTab = 'plan' | 'semaforo' | 'tramites' | 'directorio' | 'senderos';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const DEFAULT_CONTACTS: TrustedContact[] = [
  { id: '1', name: 'Laura (Hermana)', phone: '11-4567-8901', relation: 'Familiar' },
  { id: '2', name: 'Rosa (Vecina Manzana 12)', phone: '11-2345-6789', relation: 'Vecina de confianza' },
];

const INITIAL_CHECKLIST = [
  { id: 'dni', text: 'DNI propio y de tus hijas/os (original o fotocopias en bolsa plástica)', checked: false },
  { id: 'partidas', text: 'Partidas de nacimiento de hijas/os y libreta de matrimonio si corresponde', checked: false },
  { id: 'llaves', text: 'Copia duplicada de llaves de la casa / candado', checked: true },
  { id: 'dinero', text: 'Algo de dinero en efectivo para transporte o gastos inmediatos', checked: false },
  { id: 'celu', text: 'Cargador de teléfono celular portátil o cable', checked: true },
  { id: 'meds', text: 'Medicamentos recetados o libreta sanitaria', checked: false },
  { id: 'denuncias', text: 'Copias de denuncias previas o medidas cautelares anteriores si existen', checked: false },
];

const SEMAFORO_QUESTIONS = [
  {
    id: 1,
    level: 'yellow',
    question: '¿Controla tu teléfono celular, redes sociales o tus amistades?',
  },
  {
    id: 2,
    level: 'yellow',
    question: '¿Cuestiona cómo te vestís, a dónde vas o tus horarios de salida?',
  },
  {
    id: 3,
    level: 'yellow',
    question: '¿Descalifica tus opiniones o te hace sentir culpable de todo?',
  },
  {
    id: 4,
    level: 'orange',
    question: '¿Controla tus ingresos económicos o te prohíbe trabajar/estudiar?',
  },
  {
    id: 5,
    level: 'orange',
    question: '¿Rompe o golpea objetos, paredes o tus pertenencias cuando discuten?',
  },
  {
    id: 6,
    level: 'orange',
    question: '¿Te aísla de tu familia o referentes del barrio?',
  },
  {
    id: 7,
    level: 'red',
    question: '¿Te ha empujado, tironeado, golpeado o amenazado físicamente?',
  },
  {
    id: 8,
    level: 'red',
    question: '¿Te obliga o presiona a tener relaciones sexuales sin tu consentimiento?',
  },
  {
    id: 9,
    level: 'red',
    question: '¿Amenaza con quitarte a tus hijas/os o hacerles daño?',
  },
  {
    id: 10,
    level: 'red',
    question: '¿Te ha amenazado de muerte o con armas/objetos cortantes?',
  },
];

export const HerramientasScreen: React.FC<HerramientasScreenProps> = ({
  currentUser,
  onOpenSacarTurno,
  onOpenEmergency,
  onTriggerCamouflage,
  onOpenSenderoModal,
}) => {
  const [activeTab, setActiveTab] = useState<ToolSubTab>('plan');

  // Plan de Seguridad State
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('cim_safety_checklist');
      return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
    } catch {
      return INITIAL_CHECKLIST;
    }
  });

  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    try {
      const saved = localStorage.getItem('cim_trusted_contacts');
      return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  });

  const [secretWord, setSecretWord] = useState(() => {
    return localStorage.getItem('cim_secret_word') || 'Mate amargo';
  });

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Semáforo State
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [semaforoEvaluated, setSemaforoEvaluated] = useState(false);

  // Subscribe to Remote SafetyPlan in Firestore if user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToSafetyPlan(currentUser.uid, (plan) => {
      if (plan) {
        if (plan.secretWord) setSecretWord(plan.secretWord);
        if (plan.trustedContacts && plan.trustedContacts.length > 0) {
          setContacts(plan.trustedContacts);
        }
        if (plan.checklist && plan.checklist.length > 0) {
          setChecklist(plan.checklist);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Save to localStorage & Firestore
  useEffect(() => {
    localStorage.setItem('cim_safety_checklist', JSON.stringify(checklist));
    if (currentUser) {
      saveSafetyPlanToFirestore(currentUser.uid, { checklist }).catch(() => {});
    }
  }, [checklist, currentUser]);

  useEffect(() => {
    localStorage.setItem('cim_trusted_contacts', JSON.stringify(contacts));
    if (currentUser) {
      saveSafetyPlanToFirestore(currentUser.uid, { trustedContacts: contacts }).catch(() => {});
    }
  }, [contacts, currentUser]);

  useEffect(() => {
    localStorage.setItem('cim_secret_word', secretWord);
    if (currentUser) {
      saveSafetyPlanToFirestore(currentUser.uid, { secretWord }).catch(() => {});
    }
  }, [secretWord, currentUser]);

  const toggleCheckItem = (id: string) => {
    setChecklist((prev: typeof INITIAL_CHECKLIST) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const item: TrustedContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRel.trim() || 'Contacto de apoyo',
    };
    setContacts((prev) => [...prev, item]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRel('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopyAlertMessage = () => {
    const message = `Alerta de seguridad: Clave "${secretWord}". Por favor vení a buscarme o llamá al 911 / Línea 144 si no te respondo en 10 minutos.`;
    navigator.clipboard.writeText(message);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Semáforo calculations
  const redCount = Object.entries(answers).filter(
    ([id, val]) => val && SEMAFORO_QUESTIONS.find((q) => q.id === Number(id))?.level === 'red'
  ).length;

  const orangeCount = Object.entries(answers).filter(
    ([id, val]) => val && SEMAFORO_QUESTIONS.find((q) => q.id === Number(id))?.level === 'orange'
  ).length;

  const yellowCount = Object.entries(answers).filter(
    ([id, val]) => val && SEMAFORO_QUESTIONS.find((q) => q.id === Number(id))?.level === 'yellow'
  ).length;

  const getSemaforoResult = () => {
    if (redCount > 0) {
      return {
        level: 'Riesgo Alto / Urgencia',
        color: 'from-rose-500 to-rose-600',
        textColor: 'text-rose-700',
        bgBox: 'bg-rose-50 border-rose-200',
        badge: 'Alerta Roja',
        description:
          'Estás atravesando situaciones de violencia directa y riesgo para tu integridad o la de tus hijas/os. No estás sola y hay equipos preparados para intervenir de inmediato.',
        recommendation:
          'Recomendamos comunicarte de forma inmediata con el 911 si estás en peligro inminente, o acercarte al CIM Mugica u OVD para solicitar medidas cautelares y resguardo.',
      };
    }
    if (orangeCount > 0) {
      return {
        level: 'Situación de Alerta Media',
        color: 'from-amber-500 to-amber-600',
        textColor: 'text-amber-700',
        bgBox: 'bg-amber-50 border-amber-200',
        badge: 'Alerta Naranja',
        description:
          'Se identifican patrones de violencia psicológica, económica o aislamiento que suelen escalar. Es un momento crucial para informarse y fortalecer redes de apoyo.',
        recommendation:
          'Sacá un turno de asesoramiento integral en el CIM Mugica (legal y psicológico) para diseñar una estrategia con profesionales sin costo.',
      };
    }
    if (yellowCount > 0) {
      return {
        level: 'Señales Tempranas de Alerta',
        color: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-800',
        bgBox: 'bg-yellow-50 border-yellow-200',
        badge: 'Alerta Amarilla',
        description:
          'Existen conductas de control, celos y desvalorización que no deben naturalizarse. Un vínculo saludable se basa en el respeto mutuo y la libertad.',
        recommendation:
          'Podés participar de nuestros talleres de empoderamiento y vincularte con las orientadoras del CIM para reflexionar en un espacio seguro.',
      };
    }
    return {
      level: 'Vínculo Aparentemente Saludable',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-700',
      bgBox: 'bg-emerald-50 border-emerald-200',
      badge: 'Nivel Verde',
      description:
        'No se registran indicadores directos de alerta en este test. Recordá que siempre tenés derecho a sentirte libre, segura y respetada en todos tus espacios.',
      recommendation:
        'Compartí estas herramientas con familiares, amigas o vecinas del barrio que puedan necesitar orientación.',
    };
  };

  const semaforoResult = getSemaforoResult();

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 animate-in fade-in duration-200">
      {/* Title & Quick Exit Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Recursos y Seguridad
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Herramientas CIM
          </h2>
        </div>

        {onTriggerCamouflage && (
          <button
            id="btn-quick-exit"
            onClick={onTriggerCamouflage}
            title="Salida Rápida: Oculta la aplicación de inmediato por seguridad"
            className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Salida rápida</span>
          </button>
        )}
      </div>

      {/* Intro Subtext */}
      <p className="text-xs text-slate-600 leading-relaxed">
        Herramientas prácticas, confidenciales y accesibles para tu seguridad, asesoramiento legal y red de apoyo en el Barrio Mugica.
      </p>

      {/* Sub-tab Navigation */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-purple-50/70 border border-purple-100 rounded-2xl">
        <button
          id="tab-herramientas-plan"
          onClick={() => setActiveTab('plan')}
          className={`py-2 px-0.5 text-[10px] font-bold rounded-xl transition-all ${
            activeTab === 'plan'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Plan Seguro
        </button>
        <button
          id="tab-herramientas-senderos"
          onClick={() => setActiveTab('senderos')}
          className={`py-2 px-0.5 text-[10px] font-bold rounded-xl transition-all ${
            activeTab === 'senderos'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Senderos
        </button>
        <button
          id="tab-herramientas-semaforo"
          onClick={() => setActiveTab('semaforo')}
          className={`py-2 px-0.5 text-[10px] font-bold rounded-xl transition-all ${
            activeTab === 'semaforo'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Semáforo
        </button>
        <button
          id="tab-herramientas-tramites"
          onClick={() => setActiveTab('tramites')}
          className={`py-2 px-0.5 text-[10px] font-bold rounded-xl transition-all ${
            activeTab === 'tramites'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Trámites
        </button>
        <button
          id="tab-herramientas-directorio"
          onClick={() => setActiveTab('directorio')}
          className={`py-2 px-0.5 text-[10px] font-bold rounded-xl transition-all ${
            activeTab === 'directorio'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700'
          }`}
        >
          Directorio
        </button>
      </div>

      {/* SUB-TAB 1: PLAN DE SEGURIDAD PERSONAL */}
      {activeTab === 'plan' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Card: Clave de auxilio */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-100 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Palabra Clave de Auxilio
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Acordá una palabra secreta con tus personas de confianza. Si la enviás por mensaje, sabrán que necesitás auxilio sin levantar sospechas.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                placeholder="Ej. Mate amargo o Llegó la tía"
                className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-purple-200 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCopyAlertMessage}
                className="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 flex items-center gap-1 active:scale-95 transition-all shadow-xs"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copiado' : 'Mensaje'}</span>
              </button>
            </div>
          </div>

          {/* Card: Contactos de Confianza */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Mis Contactos de Confianza
                </h3>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Vecinas, familiares o compañeras a quienes acudir en caso de emergencia.
            </p>

            {showAddContact && (
              <form
                onSubmit={handleAddContact}
                className="mb-3 p-3 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 animate-in slide-in-from-top-1"
              >
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Teléfono (ej. 11-1234-5678)"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Vínculo (ej. Vecina, Hermana)"
                    value={newContactRel}
                    onChange={(e) => setNewContactRel(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-xs"
                  >
                    Guardar contacto
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{contact.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {contact.relation} • <span className="font-semibold text-slate-700">{contact.phone}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center hover:bg-purple-200 transition-colors"
                      title="Llamar"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Bolso de Emergencia Checklist */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Bolso de Emergencia (Checklist)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {checklist.filter((i: any) => i.checked).length} de {checklist.length} listos
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Mantené estos elementos guardados en un lugar seguro y de fácil acceso si necesitás salir con urgencia.
            </p>

            <div className="space-y-2">
              {checklist.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  role="button"
                  tabIndex={0}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-purple-50/80 border-purple-200 text-purple-900'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      item.checked
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs ${item.checked ? 'line-through text-purple-900/70' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Puntos Seguros en Barrio Mugica */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Puntos Seguros en Barrio Mugica
              </h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <span><strong>Sede CIM Padre Mugica:</strong> Calle 5 y 10 (Galpón comunitario)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <span><strong>CeSAC N° 25:</strong> Calle 5 y Av. Perette (Atención de salud y derivación)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <span><strong>Parroquia Cristo Obrero:</strong> Espacio de contención comunitaria</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB: RUTAS DEL SENDERO SEGURO */}
      {activeTab === 'senderos' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Rutas del Sendero Seguro</h3>
                  <p className="text-[11px] text-purple-200">
                    Caminos protegidos hacia CIM Mugica, escuelas y salud
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full">
                4 Activas
              </span>
            </div>
            <p className="text-xs text-purple-100/90 mt-2.5 leading-relaxed">
              Los Senderos Seguros del Barrio Mugica cuentan con luminarias LED reforzadas, tótems de emergencia 911, monitoreo por cámaras y comercios adheridos para brindarte resguardo en tus traslados.
            </p>
          </div>

          {/* Cards for each Sendero */}
          <div className="space-y-3">
            {SENDEROS_DATA.map((sendero, index) => (
              <div
                key={sendero.id}
                className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-1">
                      Sendero {index + 1} • {sendero.statusText}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {sendero.name}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    {sendero.safetyScore}% Seguro
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Origen</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{sendero.origin}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Destino</span>
                    <span className="font-semibold text-purple-700 line-clamp-1">{sendero.destination}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-purple-600" />
                      <strong>{sendero.walkingTime}</strong>
                    </span>
                    <span className="text-slate-400">({sendero.distance})</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenSenderoModal) {
                        onOpenSenderoModal(sendero.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Ver Puntos Seguros</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SEMÁFORO DE VÍNCULOS */}
      {activeTab === 'semaforo' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Semáforo de Convivencia y Vínculos
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Respondé con tranquilidad estas preguntas para evaluar si en tu relación existen señales de alerta o situaciones de violencia. Este test es anónimo y confidencial.
            </p>

            <div className="space-y-2.5">
              {SEMAFORO_QUESTIONS.map((q) => {
                const isChecked = !!answers[q.id];
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
                      setSemaforoEvaluated(true);
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? q.level === 'red'
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : q.level === 'orange'
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-yellow-50 border-yellow-300 text-yellow-900'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 pr-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          q.level === 'red'
                            ? 'bg-rose-500'
                            : q.level === 'orange'
                            ? 'bg-amber-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="text-xs leading-snug">{q.question}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset button */}
            {Object.keys(answers).length > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSemaforoEvaluated(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar respuestas</span>
                </button>
              </div>
            )}
          </div>

          {/* Assessment Result Card */}
          <div
            className={`p-4 rounded-3xl border shadow-sm transition-all ${semaforoResult.bgBox}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white bg-gradient-to-r ${semaforoResult.color}`}
              >
                {semaforoResult.badge}
              </span>
              <span className={`text-xs font-black ${semaforoResult.textColor}`}>
                {semaforoResult.level}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium mb-2">
              {semaforoResult.description}
            </p>

            <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-black/5 leading-relaxed mb-3">
              💡 {semaforoResult.recommendation}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenSacarTurno}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Sacar turno en CIM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenEmergency}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar al 144</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GUÍA DE TRÁMITES Y DERECHOS */}
      {activeTab === 'tramites' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Trámite 1: Medidas Cautelares */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Medidas de Protección Cautelar
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Son órdenes judiciales urgentes dictadas por un juez de familia o penal para frenar el hostigamiento o agresiones.
            </p>
            <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 text-xs text-slate-700 space-y-1.5">
              <p><strong>¿Cuáles son las más frecuentes?</strong></p>
              <p>• <strong>Perimetral de acercamiento:</strong> Prohibición de acercarse a vos, tu domicilio o escuela de tus hijas/os.</p>
              <p>• <strong>Exclusión del hogar:</strong> La persona agresora debe retirarse de la vivienda compartida.</p>
              <p>• <strong>Botón antipánico o tobillera:</strong> Dispositivo geolocalizado de alerta policial.</p>
            </div>
            <button
              onClick={onOpenSacarTurno}
              className="mt-3 w-full py-2 px-3 rounded-xl border border-purple-300 text-purple-700 hover:bg-purple-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Consultar con abogadas de CIM Mugica</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Trámite 2: Dónde y cómo denunciar en CABA */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                ¿Dónde radicar una denuncia en CABA?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
              No necesitás abogado particular para formular la denuncia inicial.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">1. Oficina de Violencia Doméstica (OVD)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Lavalle 1250, CABA • <strong>Abierta las 24 horas los 365 días del año</strong>. Te atiende un equipo interdisciplinario (médico, psicólogo, asistente social y abogado).
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">2. Comisaría Comunal 1 (Retiro)</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Av. Suipacha 1156 / Retiro • Recepción de denuncias penales e intervención inmediata de guardia.
                </span>
              </div>
            </div>
          </div>

          {/* Trámite 3: Programas y Acompañamiento Económico */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Programas de Apoyo Económico y Social
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Si estás en situación de violencia de género, existen subsidios estatales y programas de acompañamiento económico para ayudarte a lograr autonomía habitacional y económica.
            </p>
            <p className="text-xs text-slate-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              📌 Las trabajadoras sociales de <strong>CIM Padre Mugica</strong> gestionan el informe socioeconómico y la articulación con los programas vigentes de CABA y Nación.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DIRECTORIO TELEFÓNICO RÁPIDO */}
      {activeTab === 'directorio' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* 144 */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                144
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Línea 144</h4>
                <p className="text-[11px] text-slate-600">Atención, contención y asesoramiento 24/7</p>
              </div>
            </div>
            <a
              href="tel:144"
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </a>
          </div>

          {/* 911 */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm">
                911
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Emergencias 911</h4>
                <p className="text-[11px] text-slate-600">Policía de la Ciudad ante peligro inminente</p>
              </div>
            </div>
            <a
              href="tel:911"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </a>
          </div>

          {/* OVD */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">OVD - Corte Suprema</h4>
              <p className="text-[11px] text-slate-500">Lavalle 1250 • Guardia 24hs</p>
              <p className="text-[11px] font-semibold text-purple-700 mt-0.5">0800-333-4722 / 4123-1741</p>
            </div>
            <a
              href="tel:41231741"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </a>
          </div>

          {/* CIM Mugica Directo */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">CIM Padre Mugica</h4>
              <p className="text-[11px] text-slate-500">Atención de Lunes a Viernes 9 a 17 hs</p>
              <p className="text-[11px] font-semibold text-purple-700 mt-0.5">11-2856-9812</p>
            </div>
            <a
              href="tel:1128569812"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </a>
          </div>

          {/* CeSAC 25 */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">CeSAC N° 25 (Salud Retiro)</h4>
              <p className="text-[11px] text-slate-500">Calle 5 y Av. Perette, Barrio Mugica</p>
              <p className="text-[11px] font-semibold text-purple-700 mt-0.5">11-4315-1815</p>
            </div>
            <a
              href="tel:1143151815"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
            >
              <Phone className="w-3 h-3" />
              <span>Llamar</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
