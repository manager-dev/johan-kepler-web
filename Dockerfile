# 01_manifiesto_core: Uso de versiones específicas para inmutabilidad
FROM nginx:1.25-alpine

# Metadatos del proyecto
LABEL maintainer="Arquitectura Johan Kepler"
LABEL project="Demo Institucional Assets"

# 1. Copiamos el archivo principal (index.html)
COPY index.html /usr/share/nginx/html/index.html

# 2. Copiamos la carpeta de activos (assets) completa
# Al usar assets/ (con slash) Docker copia el CONTENIDO de tu carpeta local 
# dentro de la carpeta /assets/ del contenedor.
COPY .public/ /usr/share/nginx/html/assets/

# 3. SEGURIDAD Y CONTROL: Ajuste de propietario y permisos
# En sistemas Linux/Docker, es vital que el usuario que corre el servicio (nginx)
# sea el dueño de los archivos para evitar errores 403 o fallos de lectura.
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exposición del puerto estándar para tráfico HTTP
EXPOSE 80

# NOTA ARQUITECTÓNICA: No se define ENTRYPOINT para heredar el script oficial 
# de Nginx Alpine. CMD proporciona los argumentos de ejecución.
CMD ["nginx", "-g", "daemon off;"]
