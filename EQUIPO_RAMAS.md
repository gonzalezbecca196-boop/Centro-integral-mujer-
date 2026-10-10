# 👥 Guía de Organización del Equipo en 3 Ramas

Este proyecto está dividido en **3 ramas de trabajo** para que los integrantes del equipo puedan desarrollar simultáneamente sin generar conflictos de código.

---

## 🌿 Las 3 Ramas de Trabajo

| Rama | Área | Archivos y Responsabilidades Clave |
| :--- | :--- | :--- |
| **`feature/pantalla-principal-y-agenda`** | **Pantalla Principal y Agenda** | • Dashboard de inicio (`HomeScreen.tsx`)<br>• Sistema de turnos y guardias (`AgendaScreen.tsx`)<br>• Modales de asignación y detalles (`SacarTurnoModal.tsx`, `TurnoDetailsModal.tsx`)<br>• Navegación entre vistas (`BottomNav.tsx`, `DrawerNav.tsx`) |
| **`feature/base-de-datos-y-diseno`** | **Base de Datos y Diseño** | • Configuración y reglas de Firebase (`firebase.ts`)<br>• Modelos y tipado de datos (`types.ts`, `data/mockData.ts`)<br>• Estilos globales, paleta CIM y temas (`index.css`, Tailwind)<br>• Componentes visuales y maquetación (`PhoneFrame.tsx`, `Header.tsx`) |
| **`feature/comunicacion-y-conexion`** | **Comunicación y Conexión** | • Chat interno interdisciplinario (`ChatScreen.tsx`)<br>• Notificaciones en tiempo real (`NotificationsModal.tsx`)<br>• Botón y protocolo de emergencia (`EmergencyModal.tsx`)<br>• Red de Senderos Seguros y comercios (`SenderosSegurosModal.tsx`, `SenderosAdminScreen.tsx`) |

---

## 🚀 Cómo empezar a trabajar en tu rama

### 1. Clonar el repositorio y ver las ramas disponibles
```bash
git clone <URL_DEL_REPOSITORIO>
cd cim-mugica
git branch -a
```

### 2. Cambiarte a la rama que te corresponde

#### 👉 Si estás en el equipo de **Pantalla Principal y Agenda**:
```bash
git checkout feature/pantalla-principal-y-agenda
```

#### 👉 Si estás en el equipo de **Base de Datos y Diseño**:
```bash
git checkout feature/base-de-datos-y-diseno
```

#### 👉 Si estás en el equipo de **Comunicación y Conexión**:
```bash
git checkout feature/comunicacion-y-conexion
```

---

## 🔄 Flujo diario de trabajo (Git Workflow)

### Paso 1: Actualizar tu rama con los últimos cambios de `main`
Antes de empezar a codear, trae lo que otros integrantes hayan integrado a la rama principal:
```bash
git fetch origin
git merge origin/main
```

### Paso 2: Realizar cambios y guardar commits
Haz commits descriptivos y atómicos:
```bash
# Ejemplo Equipo 1:
git add src/components/AgendaScreen.tsx
git commit -m "feat(agenda): agregar ordenamiento de turnos por horario"

# Ejemplo Equipo 2:
git add src/types.ts src/firebase.ts
git commit -m "feat(db): agregar esquema de auditoría en legajos"

# Ejemplo Equipo 3:
git add src/components/ChatScreen.tsx
git commit -m "feat(chat): habilitar confirmación de lectura en mensajes"
```

### Paso 3: Subir tu rama a GitHub / GitLab
```bash
# Si es la primera vez que subes la rama:
git push -u origin feature/<nombre-de-tu-rama>

# En los siguientes envíos:
git push
```

### Paso 4: Unificar el trabajo (Pull Request / Merge)
1. En GitHub/GitLab, abre una **Pull Request (PR)** desde tu rama hacia `main`.
2. Los demás integrantes revisan que todo compile sin errores (`npm run build`).
3. Se realiza el merge a `main`.
4. Todos los integrantes actualizan sus ramas locales haciendo `git merge main`.

---

## 🔁 Guía Práctica: ¿Cómo sincronizar con `main`?

### Caso A: Estás en tu rama y quieres traer lo nuevo que subieron tus compañeros a `main`
```bash
# 1. Asegúrate de guardar tus cambios locales primero
git add .
git commit -m "guardar mi trabajo actual"

# 2. Descargar las novedades del repositorio remoto
git fetch origin

# 3. Fusionar lo nuevo de main dentro de tu rama de trabajo
git merge origin/main

# ¡Listo! Tu rama ahora tiene tus cambios MÁS los cambios nuevos de tus compañeros.
```

### Caso B: Terminaste una función en tu rama y quieres pasarla a `main`
```bash
# 1. Cambiar a la rama main
git checkout main

# 2. Asegurarte de que tu main local esté al día con la nube
git pull origin main

# 3. Unir tu rama feature dentro de main
git merge feature/pantalla-principal-y-agenda   # (o el nombre de tu rama)

# 4. Subir la rama main actualizada a GitHub / remoto
git push origin main
```

---

## 📁 Guía Práctica: ¿Cómo hacer las carpetas en el proyecto y en Git?

### ⚠️ Regla de Oro de Git:
**Git no registra carpetas vacías**. Si creas una carpeta y no tiene ningún archivo adentro, Git no la detectará ni la subirá. Por eso se coloca un archivo oculto llamado `.gitkeep`.

### 1. Cómo crear carpetas desde la Terminal
Puedes crearlas de una sola vez con el comando `mkdir -p`:

```bash
# Para la Rama 1 (Pantalla Principal y Agenda):
mkdir -p src/components/agenda
mkdir -p src/components/home

# Para la Rama 2 (Base de Datos y Diseño):
mkdir -p src/services/firebase
mkdir -p src/styles
mkdir -p src/components/ui

# Para la Rama 3 (Comunicación y Conexión):
mkdir -p src/components/chat
mkdir -p src/components/senderos
```

### 2. Cómo hacer que Git reconozca las carpetas nuevas
Si la carpeta aún no tiene código, agrégale un `.gitkeep`:
```bash
touch src/components/agenda/.gitkeep
git add src/components/agenda/.gitkeep
git commit -m "chore: crear carpeta para modulos de agenda"
```

### 3. Cómo crear carpetas desde VS Code / Editor visual
1. En el panel izquierdo de archivos, haz clic derecho sobre la carpeta `src` o `components`.
2. Elige **"New Folder"** (Nueva carpeta) y escribe el nombre (por ejemplo `agenda`).
3. Arrastra los archivos que le corresponden o crea un archivo nuevo dentro.
4. Recuerda actualizar las rutas en los `import` de los archivos que la usen (por ejemplo si un archivo pasa a `src/components/agenda/AgendaScreen.tsx`, se importa como `'./components/agenda/AgendaScreen'`).

