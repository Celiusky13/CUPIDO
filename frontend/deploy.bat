@echo off
REM Script de despliegue para el frontend

echo 🚀 Iniciando despliegue del frontend de Cupido Voting App...

REM Instalar dependencias
echo 📦 Instalando dependencias de Node.js...
npm install

REM Construir la aplicación para producción
echo 🏗️ Construyendo aplicación para producción...
npm run build

echo 🌟 Frontend construido exitosamente!
echo Los archivos de producción están en la carpeta 'build'
echo Para ejecutar en modo desarrollo: npm start
echo La aplicación estará disponible en: http://187.33.157.136:3000

pause
