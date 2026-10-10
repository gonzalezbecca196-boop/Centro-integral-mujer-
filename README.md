# CIM Padre Mugica • Sistema de Gestión Interdisciplinaria

Aplicación web para la gestión operativa y comunitaria del **Centro Integral de la Mujer (CIM) Padre Mugica** (Barrio 31 - Retiro, CABA).

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) o [bun](https://bun.sh/)
- [Git](https://git-scm.com/)

---

## 👥 División de Trabajo en Equipo (3 Ramas Principales)

El proyecto cuenta con 3 ramas principales preparadas para el trabajo colaborativo en equipo:

1. **`feature/pantalla-principal-y-agenda`**:
   - **Responsables:** Pantalla Principal y Agenda.
   - **Archivos:** `HomeScreen.tsx`, `AgendaScreen.tsx`, `SacarTurnoModal.tsx`, `TurnoDetailsModal.tsx`, `BottomNav.tsx`.
   - **Comando:** `git checkout feature/pantalla-principal-y-agenda`

2. **`feature/base-de-datos-y-diseno`**:
   - **Responsables:** Base de Datos, Persistencia y Sistema de Diseño UI.
   - **Archivos:** `firebase.ts`, `types.ts`, `data/mockData.ts`, `index.css`, `PhoneFrame.tsx`, `Header.tsx`.
   - **Comando:** `git checkout feature/base-de-datos-y-diseno`

3. **`feature/comunicacion-y-conexion`**:
   - **Responsables:** Comunicación, Notificaciones y Conexión de Red.
   - **Archivos:** `ChatScreen.tsx`, `NotificationsModal.tsx`, `EmergencyModal.tsx`, `SenderosSegurosModal.tsx`, `SenderosAdminScreen.tsx`.
   - **Comando:** `git checkout feature/comunicacion-y-conexion`

> 📘 Para ver la guía detallada de comandos, pull requests y flujo diario, consulta [`EQUIPO_RAMAS.md`](./EQUIPO_RAMAS.md).

---

## 🛠️ Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd cim-mugica
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000`.

---

## 👥 Flujo de Trabajo en Equipo con Ramas (Git Flow)

Para trabajar en equipo de forma ordenada y sin pisarse el código:

### 1. Actualizar la rama principal
Antes de empezar a trabajar en algo nuevo, asegúrate de tener la última versión:
```bash
git checkout main
git pull origin main
```

### 2. Crear una rama para tu tarea
Crea una rama descriptiva según la convención de nombres:
- Para una nueva funcionalidad: `feature/nombre-de-la-tarea`
- Para corregir un error: `fix/descripcion-del-bug`
- Para cambios visuales o de estilos: `ui/pantalla-modificada`

**Ejemplos:**
```bash
# Crear y cambiar a la rama:
git checkout -b feature/modulo-estadisticas
git checkout -b fix/filtro-agenda
git checkout -b feature/exportar-reportes
```

### 3. Guardar tus avances y confirmar cambios
Realiza commits claros y frecuentes:
```bash
git add .
git commit -m "feat(agenda): agregar exportación de turnos a PDF"
```

### 4. Subir tu rama al repositorio remoto
```bash
git push -u origin feature/modulo-estadisticas
```

### 5. Crear una Pull Request (PR)
1. Ve a GitHub/GitLab en el repositorio.
2. Abre una **Pull Request** apuntando tu rama hacia `main`.
3. Pide a una compañera/o de equipo que revise los cambios.
4. Una vez aprobada, haz **Merge** a `main`.

---

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── components/       # Pantallas y modales (Agenda, Legajos, Chat, Senderos, etc.)
│   ├── data/             # Datos iniciales y mocks tipados
│   ├── firebase.ts       # Configuración e integración con Firebase / Firestore
│   ├── types.ts          # Definición de tipos TypeScript del sistema
│   ├── App.tsx           # Navegación principal y orquestación de estado
│   └── main.tsx          # Punto de entrada de la aplicación
├── package.json
└── vite.config.ts
```

---

## 🧪 Comandos Útiles

- `npm run dev` - Inicia el entorno local de desarrollo con HMR.
- `npm run build` - Compila la versión de producción optimizada.
- `npm run lint` - Ejecuta la verificación estática de TypeScript (`tsc --noEmit`).
