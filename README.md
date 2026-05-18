# Campeonato API

Backend para el sistema de inscripcion de equipos de campeonato.

La API esta construida con:

- NestJS
- Prisma
- PostgreSQL
- Resend para envio de enlaces por correo

## Modelo actual

La base trabaja con estas entidades principales:

- `User`: delegado del equipo
- `Team`: equipo inscrito
- `Player`: jugador del equipo
- `Category`: categoria del campeonato
- `ProfessionalCollege`: colegio profesional
- `Admin`: administrador del sistema

Reglas actuales:

- un delegado tiene un solo equipo
- un equipo tiene muchos jugadores
- el `dni` del delegado es unico
- el `email` del delegado es unico
- el `dni` del jugador es unico

## Variables de entorno

En tu `.env` deberias tener algo como esto:

```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=tu_api_key
RESEND_FROM_EMAIL="Campeonato <onboarding@resend.dev>"
DELEGATE_CONTINUATION_URL=http://localhost:3001/delegado/ficha
SESSION_TOKEN_SECRET=una_clave_larga
PORT=3000
CORS_ORIGINS=http://localhost:3001
```

> Todas las rutas tienen prefijo global `/api` (ej. `http://localhost:3000/api/inscriptions`).

## Instalacion

```bash
npm install
npx prisma generate
npx prisma db push
```

## Ejecucion

```bash
# desarrollo
npm run start:dev

# build
npm run build

# tests
npm test -- --runInBand
```

## Flujo principal del delegado

1. El delegado registra sus datos y los de su equipo con `POST /inscriptions`
2. El backend crea la inscripcion y genera un link de continuidad
3. Se envia el link al correo del delegado
4. El delegado vuelve a entrar con ese link
5. El delegado valida su acceso con `token + dni`
6. El backend devuelve un `accessToken`
7. El delegado usa ese token para editar su perfil, su equipo y sus jugadores

## Endpoints

### Inscripciones

#### `POST /inscriptions`
Crea la inscripcion inicial del delegado y su equipo.

Tambien:

- genera token de continuidad
- genera link para continuar inscripcion
- intenta enviar el link por correo

Body esperado:

```json
{
  "nombres": "Carlos",
  "apellido_paterno": "Ramos",
  "apellido_materno": "Flores",
  "dni": "12345678",
  "celular": "999888777",
  "email": "delegado@mail.com",
  "nombre_equipo": "Los Halcones",
  "categoriaId": 1,
  "colegioProfesionalId": 1
}
```

#### `GET /inscriptions`
Lista todas las inscripciones con delegado, equipo y jugadores.

#### `GET /inscriptions/:id`
Devuelve una inscripcion por id del delegado.

#### `PATCH /inscriptions/:id`
Actualiza los datos generales de una inscripcion.

#### `GET /inscriptions/access/:token`
Busca una inscripcion usando el token del link de continuidad.

#### `POST /inscriptions/recover-access`
Regenera un link de continuidad usando `dni + email`.

Body esperado:

```json
{
  "dni": "12345678",
  "email": "delegado@mail.com"
}
```

#### `POST /inscriptions/access/verify`
Valida el acceso del delegado con `token + dni`.

Devuelve un `accessToken` de sesion corta para usar en `/delegate/...`.

Body esperado:

```json
{
  "token": "TOKEN_DEL_LINK",
  "dni": "12345678"
}
```

#### `GET /inscriptions/access/me`
Devuelve la inscripcion actual del delegado usando:

```http
Authorization: Bearer TOKEN
```

### Delegate

Todas las rutas de esta seccion usan:

```http
Authorization: Bearer TOKEN_DEL_DELEGADO
```

#### `GET /delegate/me`
Devuelve el perfil del delegado autenticado.

#### `PATCH /delegate/me`
Actualiza el perfil del delegado autenticado.

#### `GET /delegate/team`
Devuelve el equipo del delegado autenticado.

#### `PATCH /delegate/team`
Actualiza el equipo del delegado autenticado.

#### `GET /delegate/players`
Lista los jugadores del equipo del delegado autenticado.

#### `POST /delegate/players`
Crea un jugador en el equipo del delegado autenticado.

Body esperado:

```json
{
  "nombres": "Juan Carlos",
  "apellido_paterno": "Perez",
  "apellido_materno": "Ramos",
  "dni": "87654321",
  "nro_colegiatura": "CAL-12345",
  "fecha_nacimiento": "1990-05-12"
}
```

#### `PATCH /delegate/players/:id`
Actualiza un jugador del equipo del delegado autenticado.

#### `DELETE /delegate/players/:id`
Elimina un jugador del equipo del delegado autenticado.

### Players

Estas rutas son mas administrativas o de consulta general.

#### `GET /players`
Lista todos los jugadores con delegado y equipo.

#### `GET /players/:id`
Devuelve un jugador por id.

#### `PATCH /players/:id`
Actualiza un jugador por id.

#### `DELETE /players/:id`
Elimina un jugador por id.

#### `GET /teams/:teamId/players`
Lista los jugadores de un equipo.

#### `POST /users/:userId/players`
Crea un jugador usando el delegado como referencia.

#### `POST /users/:userId/teams/:teamId/players`
Crea un jugador validando que ese equipo pertenezca al delegado.

### Users

#### `GET /users`
Lista todos los delegados.

#### `GET /users/:id`
Devuelve un delegado por id.

#### `GET /users/with-team`
Lista delegados con su equipo y jugadores.

#### `GET /users/:id/with-team`
Devuelve un delegado con su equipo y jugadores.

#### `PATCH /users/:id`
Actualiza un delegado por id.

### Teams

#### `GET /teams`
Lista todos los equipos.

#### `GET /teams/:id`
Devuelve un equipo por id.

#### `GET /teams/with-users`
Lista equipos con delegado y jugadores.

#### `GET /teams/:id/with-user`
Devuelve un equipo con delegado y jugadores.

#### `PATCH /teams/:id`
Actualiza un equipo por id.

### Categorias

#### `GET /categorias`
Lista categorias.

#### `GET /categorias/:id`
Devuelve categoria por id.

#### `POST /categorias`
Crea categoria.

#### `PATCH /categorias/:id`
Actualiza categoria.

#### `DELETE /categorias/:id`
Elimina categoria.

### Colegios profesionales

#### `GET /colegios-profesionales`
Lista colegios profesionales.

#### `GET /colegios-profesionales/:id`
Devuelve un colegio profesional por id.

#### `POST /colegios-profesionales`
Crea colegio profesional.

#### `PATCH /colegios-profesionales/:id`
Actualiza colegio profesional.

#### `DELETE /colegios-profesionales/:id`
Elimina colegio profesional.

### Admins

#### `GET /admins`
Lista administradores.

#### `GET /admins/:id`
Devuelve administrador por id.

#### `POST /admins`
Crea administrador.

Body esperado:

```json
{
  "organizador": "Comite Central",
  "correo": "admin@mail.com",
  "nro_celular": "999888777",
  "dni": "12345678",
  "password": "123456"
}
```

#### `PATCH /admins/:id`
Actualiza administrador.

#### `DELETE /admins/:id`
Elimina administrador.

### Auth

#### `POST /auth/admin/login`
Login de administrador por correo o dni con password.

Body posible:

```json
{
  "correo": "admin@mail.com",
  "password": "123456"
}
```

o:

```json
{
  "dni": "12345678",
  "password": "123456"
}
```

#### `GET /auth/admin/me`
Devuelve el admin autenticado con:

```http
Authorization: Bearer TOKEN
```

### Campeonato (partidos, fixture, tabla, goleadores, tarjetas)

Modelos `Match` y `MatchEvent`. Ver detalle en `ENDPOINTS.md`.

Resumen rapido:

- `POST /fixture/generate` (admin) genera round-robin de una categoria.
- `PATCH /matches/:id` (admin) edita fecha, cancha, jornada o equipos.
- `PATCH /matches/:id/resultado` (admin) carga marcador y deja el partido `FINALIZADO`.
- `POST /matches/:id/eventos` (admin) registra `GOL`, `AMARILLA`, `AZUL` o `ROJA` para un jugador.
- `GET /standings?categoryId=` calcula PJ/PG/PE/PP/GF/GC/DG/Pts (3-1-0).
- `GET /scorers?categoryId=` y `GET /cards?categoryId=` para reportes por jugador.
- `GET /fixture?categoryId=` devuelve partidos agrupados por jornada.

Las tarjetas son solo conteo visual; no hay sancion automatica por acumulacion.

## Notas

- el backend ya envia el link de continuidad por correo usando Resend
- si Resend esta en modo prueba, solo podras enviar a tu propio correo autorizado
- si quieres enviar a cualquier delegado real, debes verificar dominio en Resend
- el siguiente bloque natural del proyecto es el reporte de fichas y luego el frontend
