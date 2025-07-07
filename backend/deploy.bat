@echo off
REM Script de despliegue para Windows

echo 🚀 Iniciando despliegue del backend de Cupido Voting App...

REM Instalar dependencias de Python
echo 📦 Instalando dependencias de Python...
pip install -r requirements.txt

REM Crear la base de datos si no existe
echo 🗄️ Inicializando base de datos...
python -c "from app import init_db; init_db()"

REM Configurar variables de entorno para producción
set FLASK_ENV=production
set FLASK_DEBUG=False

echo 🌟 Backend configurado y listo para ejecutar!
echo Para iniciar el servidor, ejecuta: python app.py
echo El servidor estará disponible en: http://187.33.157.136:5000

pause
