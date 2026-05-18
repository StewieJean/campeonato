# Endpoints - Campeonato API

Listado de endpoints disponibles, agrupados por modulo.

Base URL: `http://localhost:3000/api`

Convenciones:
- `Authorization: Bearer TOKEN` indica que la ruta requiere token de sesion.
- Los `:id`, `:userId`, `:teamId`, `:token` son parametros de ruta.

---

## App

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/` | Healthcheck / mensaje base. |

---

## Auth

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/auth/admin/login` | - | Login de administrador con `correo` o `dni` + `password`. |
| GET | `/auth/admin/me` | Bearer admin | Devuelve el admin autenticado. |
| POST | `/auth/delegate/login` | - | Login del delegado con `email + dni`. Devuelve token de sesion. |
| GET | `/auth/delegate/me` | Bearer delegado | Devuelve el delegado autenticado. |

Body de `POST /auth/admin/login`:

```json
{ "correo": "admin@mail.com", "password": "123456" }
```

o:

```json
{ "dni": "12345678", "password": "123456" }
```

Body de `POST /auth/delegate/login`:

```json
{ "email": "delegado@mail.com", "dni": "12345678" }
```

---

## Inscriptions

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/inscriptions` | - | Crea inscripcion inicial (delegado + equipo) y envia notificacion por correo. |
| GET | `/inscriptions` | - | Lista todas las inscripciones con delegado, equipo y jugadores. |
| GET | `/inscriptions/:id` | - | Devuelve inscripcion por id del delegado. |
| PATCH | `/inscriptions/:id` | - | Actualiza datos generales de una inscripcion. |

Body de `POST /inscriptions`:

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

---

## Delegate

Todas las rutas requieren `Authorization: Bearer TOKEN_DEL_DELEGADO`.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/delegate/me` | Perfil del delegado autenticado. |
| PATCH | `/delegate/me` | Actualiza el perfil del delegado autenticado. |
| GET | `/delegate/team` | Equipo del delegado autenticado. |
| PATCH | `/delegate/team` | Actualiza el equipo del delegado autenticado. |
| GET | `/delegate/players` | Lista jugadores del equipo del delegado. |
| GET | `/delegate/players/:id/carnet` | Devuelve el carnet de un jugador del equipo del delegado. |
| POST | `/delegate/players` | Crea un jugador en el equipo del delegado (acepta foto opcional). |
| PATCH | `/delegate/players/:id` | Actualiza un jugador del equipo del delegado (acepta foto opcional). |
| DELETE | `/delegate/players/:id` | Elimina un jugador del equipo del delegado. |

`POST /delegate/players` y `PATCH /delegate/players/:id` aceptan `multipart/form-data` con un campo `file` opcional (foto del jugador) ademas de los campos del jugador.

Body de `POST /delegate/players` (campos del form):

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

---

## Players

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/players` | Lista todos los jugadores con delegado y equipo. |
| GET | `/players/:id` | Devuelve un jugador por id. |
| GET | `/players/:id/carnet` | Devuelve el carnet (datos para impresion / verificacion) de un jugador. |
| PATCH | `/players/:id` | Actualiza un jugador por id. |
| DELETE | `/players/:id` | Elimina un jugador por id. |
| GET | `/teams/:teamId/players` | Lista jugadores de un equipo. |
| POST | `/users/:userId/players` | Crea jugador usando el delegado como referencia. |
| POST | `/users/:userId/teams/:teamId/players` | Crea jugador validando que el equipo pertenezca al delegado. |

---

## Public (carnets)

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/public/carnets/:codigo/verify` | - | Verifica publicamente un carnet por su `codigo` (ruta usada por el QR del carnet). |

---

## Users (delegados)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/users` | Lista todos los delegados. |
| GET | `/users/with-team` | Lista delegados con su equipo y jugadores. |
| GET | `/users/:id` | Devuelve un delegado por id. |
| GET | `/users/:id/with-team` | Devuelve un delegado con su equipo y jugadores. |
| PATCH | `/users/:id` | Actualiza un delegado por id. |

---

## Teams

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/teams` | Lista todos los equipos. |
| GET | `/teams/with-users` | Lista equipos con delegado y jugadores. |
| GET | `/teams/:id` | Devuelve un equipo por id. |
| GET | `/teams/:id/with-user` | Devuelve un equipo con delegado y jugadores. |
| PATCH | `/teams/:id` | Actualiza un equipo por id. |

---

## Categorias

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/categorias` | Lista categorias. |
| GET | `/categorias/:id` | Devuelve categoria por id. |
| POST | `/categorias` | Crea categoria. |
| PATCH | `/categorias/:id` | Actualiza categoria. |
| DELETE | `/categorias/:id` | Elimina categoria. |

---

## Colegios profesionales

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/colegios-profesionales` | Lista colegios profesionales. |
| GET | `/colegios-profesionales/:id` | Devuelve un colegio profesional por id. |
| POST | `/colegios-profesionales` | Crea colegio profesional. |
| PATCH | `/colegios-profesionales/:id` | Actualiza colegio profesional. |
| DELETE | `/colegios-profesionales/:id` | Elimina colegio profesional. |

---

## Admins

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/admins` | Lista administradores. |
| GET | `/admins/:id` | Devuelve administrador por id. |
| POST | `/admins` | Crea administrador. |
| PATCH | `/admins/:id` | Actualiza administrador. |
| DELETE | `/admins/:id` | Elimina administrador. |

Body de `POST /admins`:

```json
{
  "organizador": "Comite Central",
  "correo": "admin@mail.com",
  "nro_celular": "999888777",
  "dni": "12345678",
  "password": "123456"
}
```

---

# CAMPEONATO

Modulo para administrar partidos, fixture, tabla de posiciones, goleadores y tarjetas.

## Tipos y enums

- `estado` (Match): `"PROGRAMADO"` (default al crear) | `"FINALIZADO"` (se setea al cargar resultado).
- `tipo` (MatchEvent): `"GOL"` | `"AMARILLA"` | `"AZUL"` | `"ROJA"`.
- `fecha`: ISO 8601 en UTC (ej. `"2026-06-01T18:00:00.000Z"`). Puede ser `null` (partido sin programar).
- Las tarjetas son **solo conteo visual**. No hay logica de suspension automatica.

## Errores comunes

| Codigo | Cuando ocurre |
|--------|---------------|
| 400 | DTO invalido, equipo local == visitante, jugador no pertenece a ninguno de los equipos del partido, tipo de tarjeta invalido. |
| 401 | Falta `Authorization: Bearer ...` o token no es de admin (en rutas admin). |
| 404 | Partido / categoria / jugador / evento no encontrado. |
| 409 | `POST /fixture/generate` y ya existen partidos para esa categoria (envia `sobrescribir: true` para regenerar). |

---

## Matches

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/matches` | - | Lista partidos. Filtros: `?categoryId=&jornada=&estado=&fecha=YYYY-MM-DD`. |
| GET | `/matches/:id` | - | Detalle del partido con equipos y eventos. |
| POST | `/matches` | Bearer admin | Crea un partido manualmente. |
| PATCH | `/matches/:id` | Bearer admin | Edita jornada, fecha, cancha o equipos. |
| DELETE | `/matches/:id` | Bearer admin | Elimina partido (cascadea eventos). |
| PATCH | `/matches/:id/resultado` | Bearer admin | Carga marcador y marca `FINALIZADO`. |
| POST | `/matches/:id/eventos` | Bearer admin | Registra un gol o tarjeta de un jugador. |
| DELETE | `/matches/:id/eventos/:eventId` | Bearer admin | Borra un evento mal cargado. |

### `GET /matches`

Query params (todos opcionales):

| Param | Tipo | Descripcion |
|-------|------|-------------|
| `categoryId` | number | Filtra por categoria. |
| `jornada` | number | Filtra por numero de jornada. |
| `estado` | string | `PROGRAMADO` o `FINALIZADO`. |
| `fecha` | `YYYY-MM-DD` | Filtra por dia (rango UTC `[fecha, fecha+1)`). |

Orden de respuesta: `jornada ASC, fecha ASC, id ASC`.

Response 200:

```json
[
  {
    "id": 12,
    "categoryId": 1,
    "jornada": 1,
    "fecha": "2026-06-01T18:00:00.000Z",
    "cancha": "Cancha 1",
    "homeTeamId": 5,
    "awayTeamId": 7,
    "homeGoals": 2,
    "awayGoals": 1,
    "estado": "FINALIZADO",
    "category": { "id": 1, "nombre": "Senior" },
    "homeTeam": {
      "id": 5,
      "nombre": "Los Halcones",
      "categoryId": 1,
      "professionalCollegeId": 3,
      "professionalCollege": { "id": 3, "nombre": "CIP", "abreviatura": "CIP" }
    },
    "awayTeam": { "id": 7, "nombre": "Aguilas", "professionalCollege": { "...": "..." } },
    "events": [
      {
        "id": 41,
        "matchId": 12,
        "playerId": 88,
        "teamId": 5,
        "tipo": "GOL",
        "minuto": 23,
        "player": { "id": 88, "nombres": "Juan", "apellido_paterno": "Perez", "...": "..." },
        "team": { "id": 5, "nombre": "Los Halcones", "...": "..." }
      }
    ]
  }
]
```

### `GET /matches/:id`

Mismo shape de cada item del array anterior. `404` si no existe.

### `POST /matches`  (Bearer admin)

Body:

```json
{
  "categoryId": 1,
  "jornada": 1,
  "homeTeamId": 5,
  "awayTeamId": 7,
  "fecha": "2026-06-01T18:00:00.000Z",
  "cancha": "Cancha 1"
}
```

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `categoryId` | number | si | |
| `jornada` | number ≥ 1 | si | |
| `homeTeamId` | number | si | distinto de `awayTeamId`. |
| `awayTeamId` | number | si | distinto de `homeTeamId`. |
| `fecha` | string ISO | no | `null` = sin programar. |
| `cancha` | string ≤ 200 | no | |

Response 201: mismo shape de `GET /matches/:id`.

### `PATCH /matches/:id`  (Bearer admin)

Body (todos opcionales):

```json
{
  "jornada": 2,
  "homeTeamId": 5,
  "awayTeamId": 7,
  "fecha": "2026-06-08T18:00:00.000Z",
  "cancha": "Cancha 2"
}
```

Mandar `fecha: null` para desprogramar. Response: mismo shape del detalle.

### `DELETE /matches/:id`  (Bearer admin)

Elimina el partido y cascadea sus `events`. Response 200 con el registro borrado.

### `PATCH /matches/:id/resultado`  (Bearer admin)

Body:

```json
{ "homeGoals": 2, "awayGoals": 1 }
```

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `homeGoals` | number ≥ 0 | si | |
| `awayGoals` | number ≥ 0 | si | |

Marca el partido como `FINALIZADO`. Response: mismo shape del detalle, ya con los goles y estado actualizados.

### `POST /matches/:id/eventos`  (Bearer admin)

Body:

```json
{ "playerId": 12, "tipo": "GOL", "minuto": 23 }
```

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `playerId` | number | si | El jugador debe pertenecer al equipo local o visitante del partido (si no, `400`). |
| `tipo` | enum | si | `"GOL"` \| `"AMARILLA"` \| `"AZUL"` \| `"ROJA"`. |
| `minuto` | number ≥ 0 | no | |

El backend infiere `teamId` desde el jugador, no hace falta enviarlo.

Response 201:

```json
{
  "id": 41,
  "matchId": 12,
  "playerId": 12,
  "teamId": 5,
  "tipo": "GOL",
  "minuto": 23,
  "player": { "id": 12, "nombres": "Juan", "apellido_paterno": "Perez", "...": "..." },
  "team": { "id": 5, "nombre": "Los Halcones", "...": "..." }
}
```

**Nota:** el endpoint **no** recalcula automaticamente el marcador del partido. Si registras goles, debes seguir llamando `PATCH /matches/:id/resultado` con el marcador final.

### `DELETE /matches/:id/eventos/:eventId`  (Bearer admin)

Valida que el `eventId` pertenezca al `:id` del partido (si no, `400`). Response 200 con el evento borrado.

---

## Fixture

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/fixture?categoryId=` | - | Devuelve los partidos agrupados por jornada. |
| POST | `/fixture/generate` | Bearer admin | Genera fixture round-robin (todos vs todos) para la categoria. |

### `GET /fixture?categoryId=`

Query: `categoryId` obligatorio.

Response 200:

```json
{
  "category": { "id": 1, "nombre": "Senior" },
  "totalJornadas": 5,
  "totalPartidos": 15,
  "jornadas": [
    {
      "numero": 1,
      "partidos": [
        {
          "id": 12,
          "categoryId": 1,
          "jornada": 1,
          "fecha": "2026-06-01T18:00:00.000Z",
          "cancha": "Cancha 1",
          "homeTeamId": 5,
          "awayTeamId": 7,
          "homeGoals": null,
          "awayGoals": null,
          "estado": "PROGRAMADO",
          "homeTeam": { "id": 5, "nombre": "Los Halcones", "...": "..." },
          "awayTeam": { "id": 7, "nombre": "Aguilas", "...": "..." }
        }
      ]
    }
  ]
}
```

Si la categoria no existe: `404`.

### `POST /fixture/generate`  (Bearer admin)

Body:

```json
{ "categoryId": 1, "sobrescribir": false }
```

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `categoryId` | number | si | Debe tener ≥ 2 equipos asignados. |
| `sobrescribir` | boolean | no (default `false`) | Si `true` y ya hay partidos en esa categoria, los **borra todos** (incluidos sus eventos) y regenera. |

Algoritmo: round-robin round-by-round. Con `N` equipos genera `N-1` jornadas con `N/2` partidos cada una (si `N` es impar, una "fecha libre" por jornada). Alterna local/visitante en jornadas pares/impares para balancear. Todos los partidos se crean con `estado="PROGRAMADO"`, `fecha=null`, `cancha=null` — el admin completa esos campos despues con `PATCH /matches/:id`.

Response 200:

```json
{
  "categoryId": 1,
  "equipos": 6,
  "jornadas": 5,
  "partidosCreados": 15
}
```

Errores:
- `400`: menos de 2 equipos en la categoria.
- `404`: categoria no existe.
- `409`: ya hay partidos en la categoria y no enviaste `sobrescribir: true`.

---

## Standings

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/standings?categoryId=` | - | Tabla de posiciones calculada (3-1-0). Orden: pts -> dg -> gf -> nombre. |

Solo cuenta partidos con `estado="FINALIZADO"` y goles cargados. Los partidos en `PROGRAMADO` no se incluyen.

Response 200:

```json
{
  "category": { "id": 1, "nombre": "Senior" },
  "standings": [
    {
      "posicion": 1,
      "teamId": 5,
      "nombre": "Los Halcones",
      "pj": 5,
      "pg": 4,
      "pe": 1,
      "pp": 0,
      "gf": 12,
      "gc": 3,
      "dg": 9,
      "pts": 13
    },
    {
      "posicion": 2,
      "teamId": 7,
      "nombre": "Aguilas",
      "pj": 5, "pg": 3, "pe": 1, "pp": 1, "gf": 9, "gc": 6, "dg": 3, "pts": 10
    }
  ]
}
```

Significado de columnas:

| Col | Descripcion |
|-----|-------------|
| `posicion` | Posicion en la tabla (1 = primero). |
| `pj` | Partidos jugados. |
| `pg` / `pe` / `pp` | Ganados / empatados / perdidos. |
| `gf` / `gc` | Goles a favor / en contra. |
| `dg` | Diferencia de gol (`gf - gc`). |
| `pts` | Puntos (3 por victoria, 1 por empate, 0 por derrota). |

Equipos sin partidos jugados aparecen al final con todo en `0`. Si la categoria no existe: `404`.

---

## Stats (goleadores y tarjetas)

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/scorers?categoryId=` | - | Goleadores de la categoria ordenados por cantidad de goles. |
| GET | `/cards?categoryId=&tipo=` | - | Tarjetas por jugador. `tipo` opcional. |

### `GET /scorers?categoryId=`

Cuenta todos los eventos `tipo="GOL"` cuyo partido pertenece a la categoria (sin importar el estado del partido).

Response 200:

```json
[
  {
    "goles": 7,
    "jugador": {
      "id": 12,
      "nombres": "Juan",
      "apellido_paterno": "Perez",
      "apellido_materno": "Ramos",
      "dni": "87654321",
      "foto_url": "https://...",
      "teamId": 5,
      "team": {
        "id": 5,
        "nombre": "Los Halcones",
        "category": { "id": 1, "nombre": "Senior" },
        "professionalCollege": { "id": 3, "nombre": "CIP", "abreviatura": "CIP" }
      }
    }
  },
  { "goles": 4, "jugador": { "...": "..." } }
]
```

Orden: descendente por `goles`. Si la categoria no existe: `404`.

### `GET /cards?categoryId=&tipo=`

**Sin `tipo`** (devuelve conteo de las tres tarjetas por jugador):

```json
[
  {
    "amarillas": 3,
    "azules": 1,
    "rojas": 0,
    "total": 4,
    "jugador": { "id": 12, "nombres": "Juan", "...": "..." }
  }
]
```

Orden: `total DESC, rojas DESC, azules DESC, amarillas DESC`.

**Con `tipo=AMARILLA|AZUL|ROJA`** (solo ese color):

```json
[
  { "cantidad": 3, "tipo": "AMARILLA", "jugador": { "...": "..." } },
  { "cantidad": 2, "tipo": "AMARILLA", "jugador": { "...": "..." } }
]
```

Orden: descendente por `cantidad`.

Errores:
- `400`: `tipo` invalido (no es `AMARILLA`, `AZUL` ni `ROJA`).
- `404`: categoria no existe.
