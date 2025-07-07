# Dockerfile para el backend Flask
FROM python:3.9-slim

WORKDIR /app

# Copiar requirements y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 5000

# Variables de entorno
ENV FLASK_ENV=production
ENV FLASK_DEBUG=False

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]
