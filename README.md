# 💕 Cupido Voting App 💕

<div align="center">
  <img src="backend/static/cupido-logo.png" alt="Cupido Logo" width="200"/>
  
  [![Flask](https://img.shields.io/badge/Flask-2.3.3-red?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-5.3.6-green?style=for-the-badge&logo=socket.io)](https://socket.io/)
  [![Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/Celiusky13/CUPIDO)
</div>

Una aplicación de votaciones en tiempo real con temática romántica de Cupido, desarrollada con Flask (backend) y React (frontend).

## ✨ Demo en Vivo

🌐 **Frontend**: [http://187.33.157.136:3000](http://187.33.157.136:3000)  
🔗 **API**: [http://187.33.157.136:5000](http://187.33.157.136:5000)

## 🌟 Características

- ✨ **Votaciones en tiempo real** con WebSockets
- 🔐 **Sesiones de usuario automáticas** sin necesidad de login
- 🚫 **Un voto por usuario** garantizado
- 💖 **Interfaz romántica** con animaciones de corazones
- 📊 **Resultados en vivo** sin recargar la página
- 🎨 **Diseño responsivo** y minimalista
- 🚀 **Listo para despliegue** en servidor (IP: 187.33.157.136)

## 📸 Capturas de Pantalla

<div align="center">
  <img src="docs/screenshot-main.png" alt="Pantalla Principal" width="49%"/>
  <img src="docs/screenshot-results.png" alt="Resultados en Vivo" width="49%"/>
</div>

## 🚀 Inicio Rápido

### 📋 Prerrequisitos
- Python 3.8+ 
- Node.js 16+
- pip y npm instalados

### ⚡ Instalación Rápida

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Celiusky13/CUPIDO.git
   cd CUPIDO/cupido-voting-app
   ```

2. **Backend (Terminal 1)**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **¡Listo! 🎉**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🏗️ Arquitectura

### Backend (Flask)
- **Flask** con **Flask-SocketIO** para WebSockets
- **SQLite** para persistencia de datos
- **CORS** habilitado para el frontend
- **API REST** para operaciones de votación

### Frontend (React + TypeScript)
- **React 18** con **TypeScript**
- **Styled Components** para estilos
- **Socket.IO Client** para tiempo real
- **Axios** para peticiones HTTP

## 📁 Estructura del Proyecto

```
cupido-voting-app/
├── backend/
│   ├── app.py              # Servidor Flask principal
│   ├── requirements.txt    # Dependencias Python
│   ├── deploy.bat         # Script de despliegue Windows
│   ├── deploy.sh          # Script de despliegue Linux
│   ├── Dockerfile         # Contenedor Docker
│   └── static/
│       └── cupido-logo.png
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Componente principal
│   │   └── components/
│   │       ├── VotingComponent.tsx
│   │       └── ResultsComponent.tsx
│   ├── package.json
│   ├── deploy.bat         # Script de despliegue
│   ├── Dockerfile         # Contenedor Docker
│   └── nginx.conf         # Configuración Nginx
└── docker-compose.yml     # Orquestación de servicios
```

## 🚀 Instalación y Despliegue

### Opción 1: Despliegue Manual

#### Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run build
npm start
```

### Opción 2: Scripts de Despliegue

#### Windows
```cmd
# Backend
cd backend
deploy.bat

# Frontend
cd frontend
deploy.bat
```

#### Linux/Mac
```bash
# Backend
cd backend
chmod +x deploy.sh
./deploy.sh

# Frontend
cd frontend
npm install
npm run build
npm start
```

### Opción 3: Docker (Recomendado)

```bash
# Construir y ejecutar ambos servicios
docker-compose up --build

# En modo detached
docker-compose up -d --build
```

## 🌐 URLs de Acceso

- **Frontend**: http://187.33.157.136:3000 (o puerto 80 con Docker)
- **Backend API**: http://187.33.157.136:5000
- **WebSocket**: ws://187.33.157.136:5000

## 🛠️ Configuración del Servidor

### Requisitos del Sistema
- **Python 3.8+** para el backend
- **Node.js 16+** para el frontend
- **Puerto 5000** disponible para el backend
- **Puerto 3000** (o 80) disponible para el frontend

### Variables de Entorno
```bash
# Producción
FLASK_ENV=production
FLASK_DEBUG=False
```

### Base de Datos
La aplicación utiliza SQLite que se crea automáticamente con las siguientes tablas:
- `user_sessions`: Sesiones de usuario
- `voting_options`: Opciones de votación
- `votes`: Votos registrados

## 📡 API Endpoints

### REST API
- `POST /api/session` - Crear sesión de usuario
- `GET /api/voting-options` - Obtener opciones de votación
- `POST /api/vote` - Registrar voto
- `GET /api/results` - Obtener resultados
- `GET /api/has-voted/<session_id>` - Verificar si ya votó

### WebSocket Events
- `connect` - Cliente conectado
- `vote_update` - Actualización de resultados en tiempo real
- `disconnect` - Cliente desconectado

## 🎨 Personalización

### Colores del Tema
- **Principal**: #d63384 (Rosa Cupido)
- **Secundario**: #ff6b6b (Rojo Amor)
- **Fondo**: Gradiente rosa-rojo
- **Texto**: Blanco con sombras

### Opciones de Votación
Las opciones se configuran en `backend/app.py`:
```python
default_options = [
    "💕 Romance Clásico",
    "💘 Amor Moderno", 
    "💖 Cariño Eterno",
    "💝 Pasión Verdadera"
]
```

## 🔧 Solución de Problemas

### CORS Errors
Verificar que el backend tenga configurado CORS para la IP del frontend:
```python
CORS(app, origins=["http://187.33.157.136:3000"])
```

### WebSocket Connection Issues
Verificar que SocketIO esté configurado con los origins correctos:
```python
socketio = SocketIO(app, cors_allowed_origins=["http://187.33.157.136:3000"])
```

### Base de Datos
Si hay problemas con la BD, eliminar el archivo `cupido_voting.db` y reiniciar el backend.

## 🚀 Despliegue en Producción

### Con Docker (Recomendado)
1. Clonar el repositorio en el servidor
2. Ejecutar `docker-compose up -d --build`
3. La aplicación estará disponible en los puertos configurados

### Sin Docker
1. Instalar Python 3.8+ y Node.js 16+
2. Ejecutar scripts de despliegue
3. Configurar firewall para puertos 3000 y 5000
4. Opcional: Configurar nginx como proxy reverso

## 💝 Características de Cupido

- 💖 **Animaciones de corazones** flotantes
- 🎨 **Diseño amoroso** con gradientes rosa-rojo
- 👑 **Corona** para la opción ganadora
- ✨ **Efectos hover** con pulsaciones
- 🔄 **Actualizaciones en tiempo real**
- 📱 **Diseño responsivo** mobile-first

## 📄 Licencia

Este proyecto fue creado con amor para votaciones románticas. 💕

---

**¡Hecho con amor por Cupido! 💘**
