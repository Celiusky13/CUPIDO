#!/bin/bash

# 💕 Script de Despliegue Completo - Cupido Voting App 💕
# Para servidor con IP: 187.33.157.136

echo "🚀 Iniciando despliegue completo de Cupido Voting App..."
echo "💘 Preparando el ambiente para el amor digital..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    error "Por favor ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

log "💖 Verificando dependencias del sistema..."

# Verificar Docker
if command -v docker &> /dev/null; then
    log "✅ Docker encontrado"
    DOCKER_AVAILABLE=true
else
    warning "❌ Docker no encontrado. Instalación manual requerida."
    DOCKER_AVAILABLE=false
fi

# Verificar Python
if command -v python3 &> /dev/null; then
    log "✅ Python3 encontrado"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    log "✅ Python encontrado"
    PYTHON_CMD="python"
else
    error "❌ Python no encontrado. Instala Python 3.8+ para continuar."
    exit 1
fi

# Verificar Node.js
if command -v npm &> /dev/null; then
    log "✅ Node.js y npm encontrados"
    NODE_AVAILABLE=true
else
    warning "❌ Node.js/npm no encontrado."
    NODE_AVAILABLE=false
fi

echo ""
info "🎯 Selecciona método de despliegue:"
echo "1) 🐳 Docker (Recomendado)"
echo "2) 🔧 Manual (Python + Node.js)"
echo "3) 📦 Solo Backend (Python)"
echo "4) 🌐 Solo Frontend (Node.js)"

read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        if [ "$DOCKER_AVAILABLE" = true ]; then
            log "🐳 Desplegando con Docker..."
            
            # Construir y ejecutar con Docker Compose
            docker-compose down 2>/dev/null
            docker-compose up --build -d
            
            if [ $? -eq 0 ]; then
                log "🎉 ¡Despliegue con Docker completado!"
                info "💘 Frontend disponible en: http://187.33.157.136"
                info "🔗 Backend API disponible en: http://187.33.157.136:5000"
            else
                error "❌ Error en el despliegue con Docker"
                exit 1
            fi
        else
            error "Docker no está disponible. Selecciona otra opción."
            exit 1
        fi
        ;;
    2)
        log "🔧 Desplegando manualmente..."
        
        # Backend
        log "📦 Configurando backend..."
        cd backend
        
        # Crear entorno virtual si no existe
        if [ ! -d "venv" ]; then
            $PYTHON_CMD -m venv venv
        fi
        
        # Activar entorno virtual
        source venv/bin/activate
        
        # Instalar dependencias
        pip install -r requirements.txt
        
        # Inicializar base de datos
        $PYTHON_CMD -c "from app import init_db; init_db()"
        
        # Ejecutar backend en background
        nohup $PYTHON_CMD app.py > ../backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > ../backend.pid
        
        cd ..
        
        # Frontend
        if [ "$NODE_AVAILABLE" = true ]; then
            log "🌐 Configurando frontend..."
            cd frontend
            
            # Instalar dependencias
            npm install
            
            # Construir aplicación
            npm run build
            
            # Servir aplicación (requiere serve)
            if command -v serve &> /dev/null; then
                nohup serve -s build -l 3000 > ../frontend.log 2>&1 &
                FRONTEND_PID=$!
                echo $FRONTEND_PID > ../frontend.pid
            else
                npm install -g serve
                nohup serve -s build -l 3000 > ../frontend.log 2>&1 &
                FRONTEND_PID=$!
                echo $FRONTEND_PID > ../frontend.pid
            fi
            
            cd ..
        fi
        
        log "🎉 ¡Despliegue manual completado!"
        info "💘 Frontend disponible en: http://187.33.157.136:3000"
        info "🔗 Backend API disponible en: http://187.33.157.136:5000"
        info "📋 Para detener: kill \$(cat backend.pid frontend.pid)"
        ;;
    3)
        log "📦 Desplegando solo backend..."
        cd backend
        
        if [ ! -d "venv" ]; then
            $PYTHON_CMD -m venv venv
        fi
        
        source venv/bin/activate
        pip install -r requirements.txt
        $PYTHON_CMD -c "from app import init_db; init_db()"
        
        log "🚀 Iniciando servidor Flask..."
        $PYTHON_CMD app.py
        ;;
    4)
        if [ "$NODE_AVAILABLE" = true ]; then
            log "🌐 Desplegando solo frontend..."
            cd frontend
            
            npm install
            npm run build
            
            if command -v serve &> /dev/null; then
                serve -s build -l 3000
            else
                npm install -g serve
                serve -s build -l 3000
            fi
        else
            error "Node.js no está disponible"
            exit 1
        fi
        ;;
    *)
        error "Opción inválida"
        exit 1
        ;;
esac

echo ""
log "💕 ¡Cupido Voting App desplegada con amor!"
info "🔧 Para desarrollo, usa: npm start (frontend) y python app.py (backend)"
info "📚 Documentación completa en: https://github.com/Celiusky13/CUPIDO"
echo ""
echo "  💘 ¡Que el amor digital florezca! 💘"
