# GateG - Sistema de Monitoreo de Empleados

Una aplicación web full-stack para monitoreo de productividad de empleados con gamificación.

## Estructura del Proyecto

```
GateG/
├── src/                    # Frontend React + TypeScript
├── server/                 # Backend Node.js + Express + TypeScript
├── server/schema.sql       # Esquema de base de datos MySQL
└── README.md
```

## Tecnologías

### Frontend
- React 19 + TypeScript
- Material-UI (MUI)
- React Router DOM

### Backend
- Node.js + Express + TypeScript
- MySQL con mysql2
- JWT para autenticación
- bcrypt para hashing de PINs

## Configuración

### 1. Base de Datos

Crea una base de datos MySQL llamada `gateg` y ejecuta el schema:

```bash
mysql -u root -p
CREATE DATABASE gateg;
USE gateg;
source server/schema.sql;
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edita .env con tus credenciales de MySQL
npm run dev
```

El servidor se ejecutará en `http://localhost:4000`

### 3. Frontend

```bash
# En la raíz del proyecto
npm install
cp .env.example .env
# El .env ya está configurado para apuntar al backend
npm start
```

El frontend se ejecutará en `http://localhost:3000`

## Usuarios de Prueba

El schema incluye usuarios predefinidos (PIN: 1234 para todos):

- `EMP001` - Ana García (Empleado)
- `EMP002` - Carlos López (Empleado) 
- `SUP001` - María Rodríguez (Supervisor)
- `ADM001` - Juan Martínez (Administrador)

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login con employee_code y PIN

### Empleados
- `GET /api/employee/profile` - Perfil del empleado autenticado
- `GET /api/tasks` - Tareas disponibles para el empleado

## Funcionalidades

### Implementadas
- ✅ Login con códigos de empleado y PIN
- ✅ Autenticación JWT
- ✅ Base de datos MySQL completa
- ✅ APIs básicas para empleados y tareas

### Por Implementar
- Dashboard con métricas en tiempo real
- Sistema de work logs (iniciar/completar tareas)
- Gamificación (puntos, niveles, badges)
- Panel de administrador
- Reportes y analíticas

## Desarrollo

### Ejecutar en modo desarrollo

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
npm start
```

### Compilar para producción

```bash
# Backend
cd server
npm run build
npm start

# Frontend
npm run build
```

## Esquema de Base de Datos

La base de datos incluye las siguientes tablas:
- `employees` - Información de empleados
- `teams` - Equipos de trabajo
- `task_definitions` - Definiciones de tareas
- `work_logs` - Registros de trabajo
- `gamification_levels` - Niveles de gamificación
- `badges` - Insignias del sistema
- `employee_badges` - Insignias ganadas por empleados
- `feedback_log` - Retroalimentación y mensajes

Ver `server/schema.sql` para el esquema completo.

---

## Información Original de Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
