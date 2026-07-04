# LosPerris Valorant API

API y panel web para stats de Valorant (rango, última partida, sesión del día, estadísticas) e integración con bots de Twitch (Nightbot, Fossabot, StreamElements).

**Producción:** [https://vlr.losperris.dev](https://vlr.losperris.dev)

Construida con **Astro + React**, desplegada en Vercel. Consume la API de [Henrik](https://henrikdev.xyz/). No afiliada a Riot Games ni a Valorant.

---

## Rutas web

| Ruta | Descripción |
|------|-------------|
| `/` | Landing / buscador y generador de comandos |
| `/docs` | Documentación interactiva |

---

## Endpoints API

Base URL: `https://vlr.losperris.dev`

Query opcionales en todos los endpoints de jugador:

| Param | Descripción | Valores |
|-------|-------------|---------|
| `format` | Formato de respuesta | `text` (bots) u omitir (JSON) |
| `lang` | Idioma del texto | `es` (default), `en` |
| `type` | Nivel de detalle del texto | `1` (menos) → `3` (más) |

### Rango

```
GET /api/rank/:region/:name/:tag
```

Regiones: `na`, `eu`, `ap`, `kr`, `latam`, `br`.

**Texto (`format=text`):**
- `type=1` → solo rango
- `type=2` → rango + puntos
- `type=3` → rango + puntos + MMR

### Última partida

```
GET /api/match/last/:region/:name/:tag
```

- `type=1` → mapa + agente + resultado
- `type=2` → + KDA
- `type=3` → + HS%

### Sesión de hoy

```
GET /api/today/:region/:name/:tag
```

- `type=1` → victorias / derrotas
- `type=2` → + partidas jugadas
- `type=3` → + winrate

### Estadísticas recientes

```
GET /api/stats/:region/:name/:tag
```

- `type=1` → compacto
- `type=2` → básico
- `type=3` → descriptivo

### Resumen (JSON)

```
GET /api/summary/:region/:name/:tag
```

Cuenta + rango + última partida + historial en una sola respuesta.

### Health / métricas

```
GET /api/system/stats
```

Latencia y contador de peticiones (útil para monitores de uptime).

---

## Bots de Twitch

### Nightbot / StreamElements

```
$(urlfetch https://vlr.losperris.dev/api/rank/na/NombreJugador/TAG?format=text&lang=es&type=1)
```

### Fossabot

```
$(customapi https://vlr.losperris.dev/api/rank/na/NombreJugador/TAG?format=text&lang=es&type=1)
```

También puedes generar el comando desde el panel en [vlr.losperris.dev](https://vlr.losperris.dev) tras buscar un jugador.

---

## Desarrollo local

### Requisitos

- Node.js 20+
- `HENRIK_API_KEY` (y opcionalmente Vercel KV para caché/rate limit)

### Instalación

```bash
git clone https://github.com/Ponss17/LosPerrisValorantApi.git
cd LosPerrisValorantApi
pnpm install
```

### Variables de entorno

```bash
cp .env.example .env
```

```env
HENRIK_API_KEY=tu_api_key_aqui
```

### Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo Astro |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |
| `pnpm test` | Tests (si están configurados) |

---

## Stack

- **Astro** (SSR) + **React**
- **Deploy:** Vercel (`vlr.losperris.dev`)
- **Caché:** Vercel KV / Redis
- **Datos:** Henrik Unofficial Valorant API

---

## Licencia

ISC © [Ponss17](https://github.com/Ponss17)
