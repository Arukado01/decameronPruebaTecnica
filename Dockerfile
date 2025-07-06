# --------------------------------------------------------------------
#  Fase 1 ▸ Compilar el SPA de React con pnpm
# --------------------------------------------------------------------
FROM node:20 AS spa
WORKDIR /spa
# Copiamos sólo el front-end para aprovechar caché
COPY spaDecameron/ .
RUN corepack enable && pnpm install && pnpm run build
# El resultado queda en /spa/dist

# --------------------------------------------------------------------
#  Fase 2 ▸ Imagen final con PHP-FPM + Nginx + Supervisord
# --------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS runtime

# Paquetes del sistema y extensiones PHP necesarias
RUN apk add --no-cache \
        nginx supervisor bash git \
        libpng libpng-dev libzip libzip-dev oniguruma-dev autoconf gcc g++ make \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip gd

# Directorio de la aplicación
WORKDIR /var/www

# ---------- Backend Laravel ----------
COPY apiDecameron/ .
# ---------- Frontend compilado ----------
COPY --from=spa /spa/dist public/

# ---------- Dependencias Composer ----------
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer \
 && composer install --no-dev --optimize-autoloader \
 && php artisan config:cache route:cache view:cache

# --------------------------------------------------------------------
#  Nginx + Supervisord (mantiene nginx y php-fpm vivos)
# --------------------------------------------------------------------
COPY docker/nginx.conf       /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 8080            # nginx escuchará en este puerto dentro del contenedor
CMD ["/usr/bin/supervisord","-c","/etc/supervisord.conf"]
