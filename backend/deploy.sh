#!/bin/bash

# Script de despliegue para el backend de Cupido Voting App

echo "🚀 Iniciando despliegue del backend de Cupido Voting App..."

# Instalar dependencias de Python
echo "📦 Instalando dependencias de Python..."
pip install -r requirements.txt

# Crear la base de datos si no existe
echo "🗄️ Inicializando base de datos..."
python -c "from app import init_db; init_db()"

# Configurar variables de entorno para producción
export FLASK_ENV=production
export FLASK_DEBUG=False

echo "🌟 Backend configurado y listo para ejecutar!"
echo "Para iniciar el servidor, ejecuta: python app.py"
echo "El servidor estará disponible en: http://187.33.157.136:5000"
