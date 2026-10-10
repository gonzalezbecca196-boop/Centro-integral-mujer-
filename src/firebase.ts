import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  setLogLevel,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Turno, Aviso, LegajoCaso, SenderoReport } from './types';

// Mute internal network retry logs during sandbox warmup / offline mode
setLogLevel('silent');

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId (CRITICAL: The app will break without this line)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Run connection test
testConnection().catch(() => {});

// --- AUTH HELPER FUNCTIONS ---

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Equipo Administrativo CIM',
          photoURL: result.user.photoURL || '',
          role: 'admin',
          sede: 'Sede Central Mugica',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Could not auto-sync staff profile to Firestore:', err);
      });
    }
    return result.user;
  } catch (err: any) {
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request'
    ) {
      console.info('Google Sign-In popup was closed or cancelled by the user.');
      return null;
    }
    console.warn('Google Sign-In notification:', err?.message || err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// --- FIRESTORE TURNOS OPERATIONS (Administrative) ---

export function subscribeToAdministrativeTurnos(
  onUpdate: (turnos: Turno[]) => void
): Unsubscribe {
  const path = 'turnos';
  const q = collection(db, path);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Turno[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          legajoId: data.legajoId || undefined,
          nombreUsuaria: data.nombreUsuaria || data.userName || 'Usuaria CIM',
          dni: data.dni || undefined,
          title: data.title || 'Consulta Interdisciplinaria',
          serviceType: data.serviceType || 'legal',
          dateLabel: data.dateLabel || '',
          dateTimeIso: data.dateTimeIso || new Date().toISOString(),
          location: data.location || 'Sede Central CIM Mugica',
          consultorio: data.consultorio || 'Consultorio General',
          professional: data.professional || 'Equipo de Guardia',
          urgency: data.urgency || 'normal',
          status: data.status || 'confirmado',
          notes: data.notes || '',
        });
      });
      onUpdate(list);
    },
    (error) => {
      if ((error as any)?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, path);
      } else {
        console.warn('Turnos listener status:', error.message);
      }
    }
  );
}

export async function createTurnoInFirestore(
  turno: Turno,
  staffUserId?: string
): Promise<void> {
  const path = `turnos/${turno.id}`;
  try {
    const turnoDoc = doc(db, 'turnos', turno.id);
    await setDoc(turnoDoc, {
      id: turno.id,
      legajoId: turno.legajoId || '',
      nombreUsuaria: turno.nombreUsuaria || 'Usuaria CIM',
      dni: turno.dni || '',
      title: turno.title,
      serviceType: turno.serviceType,
      dateLabel: turno.dateLabel,
      dateTimeIso: turno.dateTimeIso,
      location: turno.location,
      consultorio: turno.consultorio || 'Consultorio 1',
      professional: turno.professional || 'Equipo CIM',
      urgency: turno.urgency || 'normal',
      status: turno.status,
      notes: turno.notes || '',
      creadoPor: staffUserId || auth.currentUser?.email || 'admin',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateTurnoStatusInFirestore(
  turnoId: string,
  status: 'confirmado' | 'pendiente' | 'completado' | 'cancelado' | 'en_atencion',
  consultorio?: string,
  notes?: string
): Promise<void> {
  const path = `turnos/${turnoId}`;
  try {
    const turnoDoc = doc(db, 'turnos', turnoId);
    const updateData: Record<string, any> = { status, updatedAt: new Date().toISOString() };
    if (consultorio) updateData.consultorio = consultorio;
    if (notes) updateData.notes = notes;
    await updateDoc(turnoDoc, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTurnoFromFirestore(turnoId: string): Promise<void> {
  const path = `turnos/${turnoId}`;
  try {
    const turnoDoc = doc(db, 'turnos', turnoId);
    await deleteDoc(turnoDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- FIRESTORE LEGAJOS Y CASOS (Expedientes Confidenciales) ---

export function subscribeToLegajos(
  onUpdate: (legajos: LegajoCaso[]) => void
): Unsubscribe {
  const path = 'legajos';
  const q = collection(db, path);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: LegajoCaso[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          numeroExpediente: data.numeroExpediente || `CIM-MUG-${d.id}`,
          nombreUsuaria: data.nombreUsuaria || 'Confidencial',
          dni: data.dni || '',
          telefono: data.telefono || '',
          edad: data.edad || undefined,
          sectorBarrio: data.sectorBarrio || 'Barrio Mugica',
          riesgo: data.riesgo || 'medio',
          medidasProteccion: Array.isArray(data.medidasProteccion) ? data.medidasProteccion : [],
          estado: data.estado || 'activo',
          profesionalAsignado: data.profesionalAsignado || 'Equipo Interdisciplinario',
          derivacionOrigen: data.derivacionOrigen || 'Demanda Espontánea',
          ultimaAtencion: data.ultimaAtencion || 'Reciente',
          motivoConsulta: data.motivoConsulta || '',
          notas: data.notas || '',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      onUpdate(list);
    },
    (error) => {
      if ((error as any)?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, path);
      } else {
        console.warn('Legajos listener status:', error.message);
      }
    }
  );
}

export async function createLegajoInFirestore(legajo: LegajoCaso): Promise<void> {
  const path = `legajos/${legajo.id}`;
  try {
    const legajoDoc = doc(db, 'legajos', legajo.id);
    await setDoc(legajoDoc, {
      ...legajo,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateLegajoInFirestore(
  legajoId: string,
  data: Partial<LegajoCaso>
): Promise<void> {
  const path = `legajos/${legajoId}`;
  try {
    const legajoDoc = doc(db, 'legajos', legajoId);
    await updateDoc(legajoDoc, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// --- FIRESTORE SENDEROS SEGUROS (Monitoreo e Incidencias) ---

export function subscribeToSenderoReports(
  onUpdate: (reports: SenderoReport[]) => void
): Unsubscribe {
  const path = 'senderoReports';
  const q = collection(db, path);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SenderoReport[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          senderoId: data.senderoId || 'sendero-1',
          senderoName: data.senderoName || 'Sendero Seguro',
          puntoAfectado: data.puntoAfectado || 'Punto no especificado',
          tipoProblema: data.tipoProblema || 'luminaria',
          descripcion: data.descripcion || '',
          estado: data.estado || 'pendiente',
          fechaReporte: data.fechaReporte || 'Hoy',
          promotoraAsignada: data.promotoraAsignada || undefined,
          reportadoPor: data.reportadoPor || 'Guardia CIM',
        });
      });
      onUpdate(list);
    },
    (error) => {
      if ((error as any)?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, path);
      } else {
        console.warn('SenderoReports listener status:', error.message);
      }
    }
  );
}

export async function updateSenderoReportStatusInFirestore(
  reportId: string,
  estado: 'pendiente' | 'en_reparacion' | 'resuelto',
  promotoraAsignada?: string
): Promise<void> {
  const path = `senderoReports/${reportId}`;
  try {
    const repDoc = doc(db, 'senderoReports', reportId);
    const updateData: Record<string, any> = { estado, updatedAt: new Date().toISOString() };
    if (promotoraAsignada) updateData.promotoraAsignada = promotoraAsignada;
    await updateDoc(repDoc, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function createSenderoReportInFirestore(report: SenderoReport): Promise<void> {
  const path = `senderoReports/${report.id}`;
  try {
    const repDoc = doc(db, 'senderoReports', report.id);
    await setDoc(repDoc, {
      ...report,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// --- FIRESTORE AVISOS OPERATIONS ---

export function subscribeToAvisos(
  onUpdate: (avisos: Aviso[]) => void
): Unsubscribe {
  const path = 'avisos';
  const q = collection(db, path);

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Aviso[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title,
          description: data.description || '',
          tag: data.tag || 'CIM Mugica',
          tagType: data.tagType || 'recordatorio',
          date: data.date,
          actionText: data.actionText || undefined,
          cupoMaximo: data.cupoMaximo || 25,
          inscriptasCount: data.inscriptasCount || 0,
        });
      });
      onUpdate(list);
    },
    (error) => {
      if ((error as any)?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, path);
      } else {
        console.warn('Avisos listener status:', error.message);
      }
    }
  );
}

export async function createAvisoInFirestore(aviso: Aviso): Promise<void> {
  const path = `avisos/${aviso.id}`;
  try {
    const avisoDoc = doc(db, 'avisos', aviso.id);
    await setDoc(avisoDoc, {
      ...aviso,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAvisoFromFirestore(avisoId: string): Promise<void> {
  const path = `avisos/${avisoId}`;
  try {
    const avisoDoc = doc(db, 'avisos', avisoId);
    await deleteDoc(avisoDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Backwards compatibility helpers
export function subscribeToSafetyPlan(_userId: string, _callback: (plan: any) => void): Unsubscribe {
  return () => {};
}

export async function saveSafetyPlanToFirestore(_userId: string, _plan: any): Promise<void> {
  // no-op
}

export function subscribeToUserTurnos(_userId: string, onUpdate: (turnos: Turno[]) => void): Unsubscribe {
  return subscribeToAdministrativeTurnos(onUpdate);
}
