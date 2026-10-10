import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  TabType,
  Turno,
  Aviso,
  ChatContact,
  LegajoCaso,
  SenderoReport,
  NotificationItem,
} from './types';
import {
  INITIAL_TURNOS,
  INITIAL_AVISOS,
  INITIAL_CONTACTS,
  INITIAL_LEGAJOS,
  INITIAL_SENDERO_REPORTS,
  SENDEROS_DATA,
} from './data/mockData';
import {
  auth,
  logoutUser,
  subscribeToAdministrativeTurnos,
  createTurnoInFirestore,
  updateTurnoStatusInFirestore,
  deleteTurnoFromFirestore,
  subscribeToLegajos,
  createLegajoInFirestore,
  updateLegajoInFirestore,
  subscribeToSenderoReports,
  createSenderoReportInFirestore,
  updateSenderoReportStatusInFirestore,
  subscribeToAvisos,
} from './firebase';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { LegajosScreen } from './components/LegajosScreen';
import { SenderosAdminScreen } from './components/SenderosAdminScreen';
import { ChatScreen } from './components/ChatScreen';
import { PerfilScreen } from './components/PerfilScreen';
import { DrawerNav } from './components/DrawerNav';
import { SacarTurnoModal } from './components/SacarTurnoModal';
import { CentrosModal } from './components/CentrosModal';
import { EmergencyModal } from './components/EmergencyModal';
import { TurnoDetailsModal } from './components/TurnoDetailsModal';
import { AvisoDetailsModal } from './components/AvisoDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LoginScreen } from './components/LoginScreen';
import { PhoneFrame } from './components/PhoneFrame';
import { RutasDemoModal } from './components/RutasDemoModal';
import { SenderosSegurosModal } from './components/SenderosSegurosModal';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Recordatorio de Turno',
    text: 'Entrevista psicológica de guardia programada para hoy a las 10:30 AM en Consultorio 2.',
    time: 'Hace 20 min',
    unread: true,
    action: 'agenda',
  },
  {
    id: 'n2',
    title: 'Nuevo Taller Disponible',
    text: 'Se abrieron las inscripciones para el taller de oficios y autonomía económica en Galpón Cultural.',
    time: 'Hace 2 horas',
    unread: true,
    action: 'talleres',
  },
  {
    id: 'n3',
    title: 'Mensaje de Orientación',
    text: 'Dra. Romina Paz te envió una confirmación de patrocinio para consulta.',
    time: 'Ayer',
    unread: false,
    action: 'chat',
  },
];

export default function App() {
  // Authentication State (Firebase Staff User)
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Navigation & Screen View State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [showLoginView, setShowLoginView] = useState<boolean>(false);
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const [agendaFilter, setAgendaFilter] = useState<string>('todos');

  // Core Administrative Data State
  const [turnos, setTurnos] = useState<Turno[]>(INITIAL_TURNOS);
  const [legajos, setLegajos] = useState<LegajoCaso[]>(INITIAL_LEGAJOS);
  const [senderoReports, setSenderoReports] = useState<SenderoReport[]>(INITIAL_SENDERO_REPORTS);
  const [avisos, setAvisos] = useState<Aviso[]>(INITIAL_AVISOS);
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);

  // Interactive Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('cim_mugica_notifications');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [unreadChatCount, setUnreadChatCount] = useState<number>(1);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: false } : n));
      try {
        localStorage.setItem('cim_mugica_notifications', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      try {
        localStorage.setItem('cim_mugica_notifications', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  // Modals & Drawers State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSacarTurnoOpen, setIsSacarTurnoOpen] = useState<boolean>(false);
  const [isCentrosOpen, setIsCentrosOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isRutasModalOpen, setIsRutasModalOpen] = useState<boolean>(false);
  const [isSenderosOpen, setIsSenderosOpen] = useState<boolean>(false);
  const [selectedSenderoId, setSelectedSenderoId] = useState<string>('sendero-1');
  const [selectedTurnoDetails, setSelectedTurnoDetails] = useState<Turno | null>(null);
  const [selectedAvisoDetails, setSelectedAvisoDetails] = useState<Aviso | null>(null);
  const [turnoPrefill, setTurnoPrefill] = useState<{
    service?: Turno['serviceType'];
    sede?: string;
    notes?: string;
    nombre?: string;
    legajoId?: string;
  }>({});

  // Route Synchronization Helper
  const syncRouteToUrl = (newHash: string) => {
    const cleanRoute = newHash.replace(/^#?\/?/, '');
    const targetHash = `#/${cleanRoute}`;
    try {
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } catch {
      window.location.hash = targetHash;
    }
  };

  // Switch Tab with URL Sync
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'chat') {
      setUnreadChatCount(0);
    }
    setShowLoginView(false);
    setIsSacarTurnoOpen(false);
    setIsCentrosOpen(false);
    setIsEmergencyOpen(false);
    setIsNotificationsOpen(false);
    setIsRutasModalOpen(false);
    setIsSenderosOpen(false);
    syncRouteToUrl(`/${tab}`);
  };

  // Open & Close Modals with Route Sync
  const openModal = (
    modalType: 'sacar-turno' | 'centros' | 'emergencia' | 'notificaciones' | 'rutas' | 'senderos',
    extraId?: string
  ) => {
    if (modalType === 'sacar-turno') setIsSacarTurnoOpen(true);
    if (modalType === 'centros') setIsCentrosOpen(true);
    if (modalType === 'emergencia') setIsEmergencyOpen(true);
    if (modalType === 'notificaciones') setIsNotificationsOpen(true);
    if (modalType === 'rutas') setIsRutasModalOpen(true);
    if (modalType === 'senderos') {
      if (extraId) setSelectedSenderoId(extraId);
      setIsSenderosOpen(true);
    }
    syncRouteToUrl(`/${modalType}`);
  };

  const closeModal = (
    modalType: 'sacar-turno' | 'centros' | 'emergencia' | 'notificaciones' | 'rutas' | 'senderos'
  ) => {
    if (modalType === 'sacar-turno') {
      setIsSacarTurnoOpen(false);
      setTurnoPrefill({});
    }
    if (modalType === 'centros') setIsCentrosOpen(false);
    if (modalType === 'emergencia') setIsEmergencyOpen(false);
    if (modalType === 'notificaciones') setIsNotificationsOpen(false);
    if (modalType === 'rutas') setIsRutasModalOpen(false);
    if (modalType === 'senderos') setIsSenderosOpen(false);
    syncRouteToUrl(`/${currentTab}`);
  };

  // Handle direct navigation to any demo routes
  const handleNavigateToRoute = (routePath: string) => {
    const clean = routePath.replace(/^#?\/?/, '').toLowerCase();
    if (clean === 'dashboard' || clean === 'home' || clean === 'inicio') {
      handleSelectTab('dashboard');
    } else if (clean === 'agenda' || clean === 'turnos-agenda') {
      handleSelectTab('agenda');
    } else if (clean === 'legajos' || clean === 'expedientes' || clean === 'casos') {
      handleSelectTab('legajos');
    } else if (clean === 'senderos' || clean === 'monitoreo' || clean === 'infraestructura') {
      handleSelectTab('senderos');
    } else if (clean === 'chat' || clean === 'equipo' || clean === 'interconsulta') {
      handleSelectTab('chat');
    } else if (clean === 'perfil' || clean === 'cuenta') {
      handleSelectTab('perfil');
    } else if (clean === 'login' || clean === 'ingreso') {
      setShowLoginView(true);
      syncRouteToUrl('/login');
    } else if (clean === 'sacar-turno' || clean === 'nuevo-turno') {
      openModal('sacar-turno');
    } else if (clean === 'centros' || clean === 'sedes') {
      openModal('centros');
    } else if (clean === 'emergencia' || clean === '144' || clean === 'ovd') {
      openModal('emergencia');
    } else if (clean === 'notificaciones' || clean === 'avisos') {
      openModal('notificaciones');
    } else if (clean === 'rutas' || clean === 'verificador') {
      openModal('rutas');
    } else if (clean === 'sendero' || clean === 'sendero-seguro') {
      openModal('senderos');
    }
  };

  // Initialize and listen to Route changes (hash & popstate)
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
      const rawRoute = hash || pathname;

      if (!rawRoute || rawRoute === 'dashboard' || rawRoute === 'home') {
        setCurrentTab('dashboard');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'agenda') {
        setCurrentTab('agenda');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'legajos' || rawRoute === 'expedientes' || rawRoute === 'casos') {
        setCurrentTab('legajos');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'senderos' || rawRoute === 'monitoreo') {
        setCurrentTab('senderos');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'chat' || rawRoute === 'equipo') {
        setCurrentTab('chat');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'perfil') {
        setCurrentTab('perfil');
        setShowLoginView(false);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'login') {
        setShowLoginView(true);
        setIsSacarTurnoOpen(false);
        setIsCentrosOpen(false);
        setIsEmergencyOpen(false);
        setIsNotificationsOpen(false);
        setIsRutasModalOpen(false);
        setIsSenderosOpen(false);
      } else if (rawRoute === 'sacar-turno' || rawRoute === 'turnos') {
        setIsSacarTurnoOpen(true);
      } else if (rawRoute === 'centros') {
        setIsCentrosOpen(true);
      } else if (rawRoute === 'emergencia' || rawRoute === '144') {
        setIsEmergencyOpen(true);
      } else if (rawRoute === 'notificaciones') {
        setIsNotificationsOpen(true);
      } else if (rawRoute === 'rutas' || rawRoute === 'verificador') {
        setIsRutasModalOpen(true);
      } else if (rawRoute === 'sendero' || rawRoute === 'sendero-seguro') {
        setIsSenderosOpen(true);
      }
    };

    handleRouteChange();

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to real-time administrative Turnos in Firestore
  useEffect(() => {
    const unsubTurnos = subscribeToAdministrativeTurnos((remoteTurnos) => {
      if (remoteTurnos.length > 0) {
        setTurnos(remoteTurnos);
      } else {
        setTurnos(INITIAL_TURNOS);
      }
    });

    return () => unsubTurnos();
  }, []);

  // Listen to real-time Legajos in Firestore
  useEffect(() => {
    const unsubLegajos = subscribeToLegajos((remoteLegajos) => {
      if (remoteLegajos.length > 0) {
        setLegajos(remoteLegajos);
      } else {
        setLegajos(INITIAL_LEGAJOS);
      }
    });

    return () => unsubLegajos();
  }, []);

  // Listen to real-time SenderoReports in Firestore
  useEffect(() => {
    const unsubReports = subscribeToSenderoReports((remoteReports) => {
      if (remoteReports.length > 0) {
        setSenderoReports(remoteReports);
      } else {
        setSenderoReports(INITIAL_SENDERO_REPORTS);
      }
    });

    return () => unsubReports();
  }, []);

  // Listen to community Avisos
  useEffect(() => {
    const unsubAvisos = subscribeToAvisos((remoteAvisos) => {
      if (remoteAvisos.length > 0) {
        setAvisos(remoteAvisos);
      }
    });

    return () => unsubAvisos();
  }, []);

  // Turno Management Handlers
  const handleSaveTurno = async (newTurno: Turno) => {
    setTurnos((prev) => [newTurno, ...prev]);
    setCurrentTab('agenda');

    try {
      await createTurnoInFirestore(newTurno, currentUser?.uid);
    } catch (err) {
      console.warn('Error saving turno to Firestore:', err);
    }
  };

  const handleCancelTurno = async (id: string) => {
    setTurnos((prev) => prev.filter((t) => t.id !== id));
    if (selectedTurnoDetails?.id === id) {
      setSelectedTurnoDetails(null);
    }

    try {
      await deleteTurnoFromFirestore(id);
    } catch (err) {
      console.warn('Error deleting turno from Firestore:', err);
    }
  };

  const handleCompleteTurno = async (id: string) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completado' } : t))
    );
    if (selectedTurnoDetails?.id === id) {
      setSelectedTurnoDetails((prev) =>
        prev ? { ...prev, status: 'completado' } : null
      );
    }

    try {
      await updateTurnoStatusInFirestore(id, 'completado');
    } catch (err) {
      console.warn('Error updating turno status in Firestore:', err);
    }
  };

  const handleCallTurnoToRoom = async (id: string) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'en_atencion' } : t))
    );
    if (selectedTurnoDetails?.id === id) {
      setSelectedTurnoDetails((prev) =>
        prev ? { ...prev, status: 'en_atencion' } : null
      );
    }

    try {
      await updateTurnoStatusInFirestore(id, 'en_atencion');
    } catch (err) {
      console.warn('Error setting turno to en_atencion:', err);
    }
  };

  // Legajo Management Handlers
  const handleCreateLegajo = async (newLegajo: LegajoCaso) => {
    setLegajos((prev) => [newLegajo, ...prev]);
    try {
      await createLegajoInFirestore(newLegajo);
    } catch (err) {
      console.warn('Error saving legajo to Firestore:', err);
    }
  };

  const handleUpdateLegajo = async (id: string, updates: Partial<LegajoCaso>) => {
    setLegajos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    try {
      await updateLegajoInFirestore(id, updates);
    } catch (err) {
      console.warn('Error updating legajo in Firestore:', err);
    }
  };

  const handleScheduleTurnoForLegajo = (legajo: LegajoCaso) => {
    setTurnoPrefill({
      nombre: legajo.nombreUsuaria,
      legajoId: legajo.id,
      notes: `Consulta para expediente ${legajo.numeroExpediente}. Riesgo: ${legajo.riesgo.toUpperCase()}.`,
    });
    openModal('sacar-turno');
  };

  // Sendero Incidents Handlers
  const handleCreateSenderoReport = async (newReport: SenderoReport) => {
    setSenderoReports((prev) => [newReport, ...prev]);
    try {
      await createSenderoReportInFirestore(newReport);
    } catch (err) {
      console.warn('Error saving sendero report to Firestore:', err);
    }
  };

  const handleUpdateSenderoReportStatus = async (
    reportId: string,
    newStatus: 'pendiente' | 'en_reparacion' | 'resuelto',
    assignedPromotora?: string
  ) => {
    setSenderoReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              estado: newStatus,
              promotoraAsignada: assignedPromotora || r.promotoraAsignada,
            }
          : r
      )
    );
    try {
      await updateSenderoReportStatusInFirestore(
        reportId,
        newStatus,
        assignedPromotora
      );
    } catch (err) {
      console.warn('Error updating sendero report status:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Error during logout:', err);
    }
    setShowLoginView(true);
    syncRouteToUrl('/login');
  };

  const pendingReportsCount = senderoReports.filter(
    (r) => r.estado === 'pendiente'
  ).length;

  return (
    <PhoneFrame
      isFramed={isFramed}
      onToggleFramed={() => setIsFramed(!isFramed)}
      onOpenRutasModal={() => openModal('rutas')}
      onShowLogin={() => {
        setShowLoginView(true);
        syncRouteToUrl('/login');
      }}
    >
      {showLoginView ? (
        <LoginScreen
          onLoginSuccess={() => {
            setShowLoginView(false);
            syncRouteToUrl(`/${currentTab}`);
          }}
          onSkipToApp={() => {
            setShowLoginView(false);
            syncRouteToUrl(`/${currentTab}`);
          }}
        />
      ) : (
        <div className="min-h-full flex flex-col bg-[#fcfbfe] text-slate-900 relative">
          {/* Persistent Administrative Top Header */}
          <Header
            currentTab={currentTab}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenNotifications={() => openModal('notificaciones')}
            onOpenProfile={() => handleSelectTab('perfil')}
            unreadCount={unreadNotificationsCount}
            userPhotoURL={currentUser?.photoURL || undefined}
            userName={currentUser?.displayName || 'Lic. Laura Méndez'}
            activeSede="CIM Padre Mugica"
          />

          {/* Tab Screens Viewport */}
          <main className="flex-1">
            {currentTab === 'dashboard' && (
              <HomeScreen
                userName={currentUser?.displayName || 'Lic. Laura Méndez'}
                avisos={avisos}
                upcomingTurnos={turnos}
                onOpenSacarTurno={() => openModal('sacar-turno')}
                onOpenCentros={() => openModal('centros')}
                onOpenEmergency={() => openModal('emergencia')}
                onGoToAgenda={() => {
                  setAgendaFilter('todos');
                  handleSelectTab('agenda');
                }}
                onGoToChat={() => handleSelectTab('chat')}
                onSelectAviso={(aviso) => setSelectedAvisoDetails(aviso)}
                onSelectTurno={(turno) => setSelectedTurnoDetails(turno)}
              />
            )}

            {currentTab === 'agenda' && (
              <AgendaScreen
                turnos={turnos}
                initialFilter={agendaFilter}
                onOpenSacarTurno={() => openModal('sacar-turno')}
                onCancelTurno={handleCancelTurno}
                onCompleteTurno={handleCompleteTurno}
                onSelectTurnoDetails={(turno) => setSelectedTurnoDetails(turno)}
              />
            )}

            {currentTab === 'legajos' && (
              <LegajosScreen
                legajos={legajos}
                onCreateLegajo={handleCreateLegajo}
                onUpdateLegajo={handleUpdateLegajo}
                onScheduleTurnoForLegajo={handleScheduleTurnoForLegajo}
              />
            )}

            {currentTab === 'senderos' && (
              <SenderosAdminScreen
                senderos={SENDEROS_DATA}
                reports={senderoReports}
                onUpdateReportStatus={handleUpdateSenderoReportStatus}
                onCreateReport={handleCreateSenderoReport}
                onOpenCenterMap={() => openModal('centros')}
              />
            )}

            {currentTab === 'chat' && (
              <ChatScreen
                contacts={contacts}
                onOpenNewChat={() => openModal('sacar-turno')}
                onOpenEmergency={() => openModal('emergencia')}
              />
            )}

            {currentTab === 'perfil' && (
              <PerfilScreen
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenEmergency={() => openModal('emergencia')}
                onOpenLogin={() => {
                  setShowLoginView(true);
                  syncRouteToUrl('/login');
                }}
              />
            )}
          </main>

          {/* Persistent Bottom Navigation Bar (Administrative 5 tabs) */}
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => handleSelectTab(tab)}
            unreadChatCount={unreadChatCount}
            pendingReportsCount={pendingReportsCount}
            onOpenRutasModal={() => openModal('rutas')}
          />

          {/* Lateral Slide-in Drawer */}
          <DrawerNav
            currentUser={currentUser}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onNavigate={(tab) => handleSelectTab(tab)}
            onOpenSacarTurno={() => openModal('sacar-turno')}
            onOpenCentros={() => openModal('centros')}
            onOpenEmergency={() => openModal('emergencia')}
            onOpenTalleresInfo={() => {
              setAgendaFilter('todos');
              handleSelectTab('agenda');
            }}
            onOpenSettings={() => handleSelectTab('perfil')}
            onOpenSenderos={() => handleSelectTab('senderos')}
            onLogout={handleLogout}
          />

          {/* Interactive Turno Booking Modal (Admission & Assignment) */}
          <SacarTurnoModal
            isOpen={isSacarTurnoOpen}
            onClose={() => closeModal('sacar-turno')}
            onSaveTurno={handleSaveTurno}
            initialService={turnoPrefill.service}
            initialSede={turnoPrefill.sede}
            initialNotes={turnoPrefill.notes}
            initialNombre={turnoPrefill.nombre}
            initialLegajoId={turnoPrefill.legajoId}
          />

          {/* Instalaciones y Consultorios de Esta Sede */}
          <CentrosModal
            isOpen={isCentrosOpen}
            onClose={() => closeModal('centros')}
            onSelectSedeForTurno={() => {
              setTurnoPrefill({
                sede: 'CIM Padre Carlos Mugica',
                notes: 'Consulta programada en CIM Mugica (Av. Ramón Castillo y Calle 12)',
              });
              openModal('sacar-turno');
            }}
          />

          {/* Rutas del Sendero Seguro Modal */}
          <SenderosSegurosModal
            isOpen={isSenderosOpen}
            onClose={() => closeModal('senderos')}
            initialSenderoId={selectedSenderoId}
            onOpenSacarTurno={() => openModal('sacar-turno')}
            onOpenEmergency={() => openModal('emergencia')}
          />

          {/* Protocolo Línea 144 / OVD / 911 Emergency Modal */}
          <EmergencyModal
            isOpen={isEmergencyOpen}
            onClose={() => closeModal('emergencia')}
          />

          {/* Turno Details Modal */}
          <TurnoDetailsModal
            turno={selectedTurnoDetails}
            onClose={() => setSelectedTurnoDetails(null)}
            onCancelTurno={handleCancelTurno}
            onCompleteTurno={handleCompleteTurno}
            onCallToRoom={handleCallTurnoToRoom}
          />

          {/* Aviso Details Modal */}
          <AvisoDetailsModal
            aviso={selectedAvisoDetails}
            onClose={() => setSelectedAvisoDetails(null)}
            onActionClick={(aviso) => {
              const tag = aviso.tag.toLowerCase();
              let service: Turno['serviceType'] = 'psicologia';
              if (tag.includes('taller')) service = 'talleres';
              else if (tag.includes('legal')) service = 'legal';
              else if (tag.includes('salud') || tag.includes('medica'))
                service = 'medica';
              else if (tag.includes('social')) service = 'social';

              setTurnoPrefill({
                service,
                notes: `Inscripción y seguimiento desde convocatoria: ${aviso.title}`,
              });
              openModal('sacar-turno');
            }}
          />

          {/* Notifications Modal */}
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => closeModal('notificaciones')}
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onNavigateAction={(action) => {
              if (action === 'agenda' || action === 'talleres') {
                setAgendaFilter('todos');
                handleSelectTab('agenda');
              } else if (action === 'chat') {
                handleSelectTab('chat');
              }
            }}
          />

          {/* Verificador de Rutas del Demo (11 Rutas Administrativas) */}
          <RutasDemoModal
            isOpen={isRutasModalOpen}
            onClose={() => closeModal('rutas')}
            onNavigateToRoute={handleNavigateToRoute}
          />
        </div>
      )}
    </PhoneFrame>
  );
}
