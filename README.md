# 🎯 LosPerris Valorant API

API REST construida con **Express 5 + TypeScript** para obtener datos de Valorant (rango, últimas partidas, historial de MMR) e integrarla con bots de Twitch como **Nightbot** o **StreamElements**.

Desplegada en [Vercel](https://vercel.com). Consume la API pública de [Henrik](https://henrikdev.xyz/).

---

## 📋 Endpoints

Todos los endpoints aceptan el parámetro `?format=text` para devolver texto plano (ideal para bots de Twitch), y `?lang=es|en` para el idioma.

### Rango

```
GET /api/valorant/rank/:region/:name/:tag
```

| Parámetro | Descripción | Valores válidos |
|-----------|-------------|-----------------|
| `region`  | Región del servidor | `na`, `eu`, `ap`, `kr`, `latam`, `br` |
| `name`    | Nombre del jugador | 3–16 caracteres |
| `tag`     | Tag del jugador | 3–5 caracteres |

**Query params opcionales:**

| Param | Descripción | Valores |
|-------|-------------|---------|
| `format` | Formato de respuesta | `text` (plain) ó omitir (JSON) |
| `lang` | Idioma del texto | `en` (default), `es` |
| `type` | Plantilla de texto | `1`, `2`, `3` |

**Ejemplos de respuesta (text):**
- `type=1` → `Currently I am in Gold 3`
- `type=2` → `Currently I am in Gold 3 with 50 RR`
- `type=3` → `Currently I am in Gold 3 with 50 RR, my mmr is 1550`

---

### Última Partida

```
GET /api/valorant/match/:region/:name/:tag
```

**Ejemplos de respuesta (text):**
- `type=1` → `My last match was on Ascent with Jett won 20 RR`
- `type=2` → `My last match was on Ascent with Jett won 20 RR my kda was 15/5/3`

---

### Historial de MMR

```
GET /api/valorant/history/:region/:name/:tag
```

---

### Resumen completo

```
GET /api/valorant/summary/:region/:name/:tag
```

Devuelve cuenta + rango + última partida + historial en una sola petición (ideal para overlays de stream).

---

### Preview / Overlay

```
GET /api/valorant/preview/:region/:name/:tag
```

Devuelve una página HTML renderizada lista para usar como overlay en OBS.

---

## 🤖 Configuración para bots de Twitch

### Nightbot

```
$(urlfetch https://tu-dominio.vercel.app/api/valorant/rank/eu/NombreJugador/TAG?format=text&lang=es&type=2)
```

### StreamElements

```
${customapi.https://tu-dominio.vercel.app/api/valorant/rank/eu/NombreJugador/TAG?format=text&lang=es&type=2}
```

---

## 🚀 Desarrollo local

### Requisitos

- Node.js 18+
- Cuenta en [Henrik API](https://henrikdev.xyz/) para obtener una `HENRIK_API_KEY`

### Instalación

```bash
git clone https://github.com/Ponss17/LosPerrisValorantApi.git
cd LosPerrisValorantApi
npm install
```

### Variables de entorno

Copia el archivo de ejemplo y rellena tu clave:

```bash
cp .env.example .env
```

```env
PORT=3000
HENRIK_API_KEY=tu_api_key_aqui
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor arrancará en `http://localhost:3000`.

### Build para producción

```bash
npm run build
npm start
```

---

## 🧪 Tests

```bash
npm test
```

Los tests se ubican en `tests/` y usan **Jest** + **Supertest** con mocks de axios para no hacer peticiones reales.

---

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con ts-node |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Arranca el servidor compilado |
| `npm test` | Ejecuta la suite de tests |
| `npm run lint` | Analiza el código con ESLint |
| `npm run type-check` | Verifica tipos sin compilar |

---

## 📦 Stack

- **Runtime**: Node.js + Express 5
- **Lenguaje**: TypeScript 5
- **Seguridad**: Helmet, CORS, express-rate-limit, express-validator
- **Caché**: lru-cache (en memoria) + Vercel Edge Cache (`Cache-Control: s-maxage`)
- **HTTP Client**: Axios con keep-alive y conexiones reutilizadas
- **Deploy**: Vercel (serverless)
- **CI**: Husky + lint-staged (pre-commit hooks)

---

## 📄 Licencia

ISC © [Ponss17](https://github.com/Ponss17) 
