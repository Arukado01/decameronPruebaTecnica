# Decameron – Prueba Técnica  
Full-stack SPA **React + Laravel 12** con **PostgreSQL**.

* SPA (Vite + React 19 + Tailwind CSS) en `spaDecameron/`  
* API REST (Laravel 12) en `apiDecameron/`  
* Dockerfile multistage para servir **API + SPA** con *nginx + php-fpm*
---
* Se adjunta el archivo con los endpoints en producción para cargarlo en postman: **'Hotel API v1.postman_collection.json'**
* Se adjunta el dump de la bd: **'decameron_20250706_0958.dump'**
* El proyecto se subio por medio de **AWS EC2 y RDS** a la siguiente url: **http://3.139.21.107/**
---
## 0. Pre-requisitos
* PHP8.3 con extensiones: pdo_pgsql, gd, zip, curl
* Composer 2.x
* Node.js 20 LTS + pnpm ≥9 (o npm / yarn)
* PostgreSQL ≥14
* (Opcional) Docker y Docker Compose
---
## 1. Requisitos locales

| Herramienta | Versión probada | Enlace |
|-------------|-----------------|--------|
| **Git**     | ≥ 2.40          | <https://git-scm.com> |
| **Node.js** | 20 LTS          | <https://nodejs.org> |
| **pnpm**    | 9 +             | `corepack enable` |
| **PHP**     | 8.3 + ext-pdo_pgsql, gd, zip | <https://www.php.net> |
| **Composer**| 2.x             | <https://getcomposer.org> |
| **PostgreSQL** | ≥ 14         | <https://www.postgresql.org> |
| **Docker**  | 24 (opcional)   | <https://docs.docker.com> |

*(Si usas Docker no necesitas instalar Node, PHP ni Postgres).*  

---

## 2. Clonar el repositorio

```bash
git clone https://github.com/Arukado01/decameronPruebaTecnica.git
cd decameron
```

## 3. Restaurar la base de datos (.dump)
### Crear BD y usuario (psql):


```bash
sudo -u postgres psql
CREATE ROLE laravel WITH LOGIN PASSWORD 'pruebalaravelsecret';
CREATE DATABASE hotel_dev OWNER laravel;
\q
```
### Importar el dump (formato custom):
```bash
Editar
pg_restore -U laravel -d hotel_dev backups/decameron_20250706.dump
```
### o si es texto plano:
```bash
Editar
psql -U laravel -d hotel_dev -f backups/decameron_20250706.sql
```
## 4. Backend – Laravel API

### Copiar y editar el .env

```bash
cd apiDecameron
cp .env.example .env
```
### Ajustar en el .env
```bash
# Edita las variables de conexión
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=hotel_dev
DB_USERNAME=laravel
DB_PASSWORD=pruebalaravelsecret
```
### crear la api key e instalar dependencias
```bash
php artisan key:generate
composer install
```
### Correr las migraciones (Solo si es necesario, si importo del dump omitir estas)
```bash
php artisan migrate       # si no restauraste dump
```
### Crear el storage
```bash
php artisan storage:link
```
### Levantar el servidor
```bash
php artisan serve --host=0.0.0.0 --port=8000         # http://localhost:8000
```

## 5. Frontend – React SPA
### Configura la URL de la API
#### En spaDecameron/.env.development (o .env):
```bash
VITE_API_URL=http://localhost:8000/api
```
### Instalar dependencias y levantar el SPA
```bash
cd spaDecameron
pnpm install
pnpm dev           # http://localhost:5173
```
### Build para producción local

```bash
pnpm build         # genera dist/ listo para copiar a public/ de Laravel o servir con un static server
```
## 6. Integración local
### Si no usas Docker, para probar la SPA íntegra contra el API local sin mover nada:
#### En una terminal:
```bash
# backend
cd apiDecameron && php artisan serve --port=8000
```
#### En otra terminal:
```bash
# frontend
cd spaDecameron && pnpm dev --port=5173
```
### Abre tu navegador en http://localhost:5173/ y la app golpearà http://localhost:8000/api/...

## 7. Ejecutar el Docker (Opcional) 
```bash
# raíz del repo (donde está el Dockerfile)
docker build -t decameron:latest .

docker volume create decameron_storage

docker run -d --name decameron --restart unless-stopped \
  -p 80:8080 \
  -v decameron_storage:/var/www/storage \
  -e APP_ENV=production \
  -e APP_KEY=base64:ReemplazaPorTuLlave== \
  -e APP_DEBUG=false \
  -e VITE_API_URL=/api \
  -e DB_CONNECTION=pgsql \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_DATABASE=hotel_dev \
  -e DB_USERNAME=laravel \
  -e DB_PASSWORD=pruebalaravelsecret \
  decameron:latest
```
El SPA se sirve en la misma URL http://localhost/.

## 8. Endpoints de la API (prefix /api/v1/)
Todos los endpoints tienen el prefijo `/api/v1/`.

### Tabla de Endpoints

| Método  | Endpoint                                 | Descripción                     |
| ------- | ---------------------------------------- | ------------------------------- |
| **GET**    | `/hotels`                                | Lista todos los hoteles         |
| **POST**   | `/hotels`                                | Crea un nuevo hotel             |
| **GET**    | `/hotels/{id}`                           | Muestra los datos de un hotel   |
| **PUT**    | `/hotels/{id}`                           | Actualiza un hotel existente    |
| **DELETE** | `/hotels/{id}`                           | Elimina un hotel                |
| **GET**    | `/hotels/{hotel}/inventories`            | Lista habitaciones de un hotel  |
| **POST**   | `/hotels/{hotel}/inventories`            | Crea un inventario (habitaciones) |
| **GET**    | `/hotels/{hotel}/inventories/{id}`       | Muestra un inventario específico |
| **PUT**    | `/hotels/{hotel}/inventories/{id}`       | Actualiza un inventario         |
| **DELETE** | `/hotels/{hotel}/inventories/{id}`       | Elimina un inventario           |
| **GET**    | `/room-types`                            | Lista tipos de habitación       |
| **GET**    | `/accommodations`                        | Lista tipos de acomodación      |

---

## ⚙️ Ejemplos de uso con `curl`

### Listar hoteles
```bash
## En producción
curl -X GET http://3.139.21.107/api/v1/hotels

## En local
curl -X GET http://localhost/api/v1/hotels
```

## 9. Scripts útiles
```bash
# Ejecutar migraciones dentro del contenedor
docker exec -it decameron php artisan migrate --force

# Revisar logs
docker logs -f decameron