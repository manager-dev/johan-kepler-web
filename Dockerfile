# === ETAPA 1: Compilación del proyecto (Builder) ===
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copiamos los archivos de configuración y dependencias primero para aprovechar la caché
COPY package.json bun.lock ./

# Instalamos las dependencias permitiendo que Bun resuelva nativamente con el nuevo formato bun.lock
RUN bun install

# CORREGIDO: Copiamos todo el resto del proyecto manteniendo la sintaxis en una sola línea
COPY . .

# Compilamos el sitio web estático con Astro (esto genera la carpeta /app/dist)
RUN bun run build


# === ETAPA 2: Servidor de producción inmutable (Runtime) ===
FROM nginx:1.25-alpine AS runtime

# Metadatos del proyecto (Manifiesto Core)
LABEL maintainer="Arquitectura Johan Kepler"
LABEL project="Demo Institucional Assets"

# Copiamos el resultado de la compilación de Astro de la etapa anterior al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# SEGURIDAD Y CONTROL: Ajuste de propietario y permisos
# Vital en sistemas Linux para evitar errores 403 o fallos de lectura del demonio Nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exposición del puerto estándar para tráfico HTTP
EXPOSE 80

# NOTA ARQUITECTÓNICA: No se define ENTRYPOINT para heredar el script oficial 
# de Nginx Alpine. CMD proporciona los argumentos de ejecución.
CMD ["nginx", "-g", "daemon off;"]
