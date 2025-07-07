@echo off
setlocal enabledelayedexpansion

REM 💕 Script de Despliegue Completo - Cupido Voting App 💕
REM Para servidor con IP: 187.33.157.136

echo 🚀 Iniciando despliegue completo de Cupido Voting App...
echo 💘 Preparando el ambiente para el amor digital...

REM Verificar si estamos en el directorio correcto
if not exist "README.md" goto :error_directory
if not exist "backend" goto :error_directory
if not exist "frontend" goto :error_directory

echo 💖 Verificando dependencias del sistema...

REM Verificar Python
python --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Python encontrado
    set PYTHON_CMD=python
) else (
    py --version >nul 2>&1
    if %errorlevel%==0 (
        echo ✅ Python encontrado ^(py launcher^)
        set PYTHON_CMD=py
    ) else (
        echo ❌ Python no encontrado. Instala Python 3.8+ para continuar.
        goto :error_exit
    )
)

REM Verificar Node.js
npm --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js y npm encontrados
    set NODE_AVAILABLE=true
) else (
    echo ❌ Node.js/npm no encontrado.
    set NODE_AVAILABLE=false
)

REM Verificar Docker
docker --version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Docker encontrado
    set DOCKER_AVAILABLE=true
) else (
    echo ❌ Docker no encontrado. Instalación manual requerida.
    set DOCKER_AVAILABLE=false
)

echo.
echo 🎯 Selecciona método de despliegue:
echo 1^) 🐳 Docker ^(Recomendado^)
echo 2^) 🔧 Manual ^(Python + Node.js^)
echo 3^) 📦 Solo Backend ^(Python^)
echo 4^) 🌐 Solo Frontend ^(Node.js^)
echo.

set /p choice="Selecciona una opción (1-4): "

if "%choice%"=="1" goto :deploy_docker
if "%choice%"=="2" goto :deploy_manual
if "%choice%"=="3" goto :deploy_backend
if "%choice%"=="4" goto :deploy_frontend
goto :error_choice

:deploy_docker
if "%DOCKER_AVAILABLE%"=="false" (
    echo ❌ Docker no está disponible. Selecciona otra opción.
    goto :error_exit
)

echo 🐳 Desplegando con Docker...
docker-compose down >nul 2>&1
docker-compose up --build -d

if %errorlevel%==0 (
    echo 🎉 ¡Despliegue con Docker completado!
    echo 💘 Frontend disponible en: http://187.33.157.136
    echo 🔗 Backend API disponible en: http://187.33.157.136:5000
) else (
    echo ❌ Error en el despliegue con Docker
    goto :error_exit
)
goto :success

:deploy_manual
echo 🔧 Desplegando manualmente...

REM Backend
echo 📦 Configurando backend...
cd backend

REM Instalar dependencias
pip install -r requirements.txt

REM Inicializar base de datos
%PYTHON_CMD% -c "from app import init_db; init_db()"

REM Ejecutar backend en background
echo 🚀 Iniciando servidor Flask en background...
start /b %PYTHON_CMD% app.py

cd ..

REM Frontend
if "%NODE_AVAILABLE%"=="true" (
    echo 🌐 Configurando frontend...
    cd frontend
    
    REM Instalar dependencias
    npm install
    
    REM Construir aplicación
    npm run build
    
    REM Instalar serve si no existe
    npm list -g serve >nul 2>&1
    if %errorlevel% neq 0 (
        npm install -g serve
    )
    
    REM Servir aplicación
    echo 🌐 Iniciando servidor React en background...
    start /b serve -s build -l 3000
    
    cd ..
    
    echo 🎉 ¡Despliegue manual completado!
    echo 💘 Frontend disponible en: http://187.33.157.136:3000
    echo 🔗 Backend API disponible en: http://187.33.157.136:5000
) else (
    echo ❌ Node.js no disponible, solo backend desplegado
    echo 🔗 Backend API disponible en: http://187.33.157.136:5000
)
goto :success

:deploy_backend
echo 📦 Desplegando solo backend...
cd backend

pip install -r requirements.txt
%PYTHON_CMD% -c "from app import init_db; init_db()"

echo 🚀 Iniciando servidor Flask...
%PYTHON_CMD% app.py
goto :success

:deploy_frontend
if "%NODE_AVAILABLE%"=="false" (
    echo ❌ Node.js no está disponible
    goto :error_exit
)

echo 🌐 Desplegando solo frontend...
cd frontend

npm install
npm run build

npm list -g serve >nul 2>&1
if %errorlevel% neq 0 (
    npm install -g serve
)

serve -s build -l 3000
goto :success

:error_directory
echo ❌ Por favor ejecuta este script desde el directorio raíz del proyecto
goto :error_exit

:error_choice
echo ❌ Opción inválida
goto :error_exit

:error_exit
echo.
echo ❌ Despliegue fallido. Revisa los errores anteriores.
pause
exit /b 1

:success
echo.
echo 💕 ¡Cupido Voting App desplegada con amor!
echo 🔧 Para desarrollo, usa: npm start ^(frontend^) y python app.py ^(backend^)
echo 📚 Documentación completa en: https://github.com/Celiusky13/CUPIDO
echo.
echo   💘 ¡Que el amor digital florezca! 💘
echo.
pause
