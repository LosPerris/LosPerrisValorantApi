import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { SummaryResponse } from '../types/valorant';

// UI State
export const hasSearched = atom<boolean>(false);
export const isLoading = atom<boolean>(false);
export const error = atom<string>('');
export const lang = atom<string>('es');

// Modal State
export const isAboutModalOpen = atom<boolean>(false);
export const isApiKeyModalOpen = atom<boolean>(false);

// Form State
export const searchRegion = atom<string>('na');
export const searchRiotId = atom<string>('');
export const searchTag = atom<string>('');

// Data State
export const playerData = atom<SummaryResponse | null>(null);

export interface RecentSearch {
  region: string;
  riotId: string;
  tag: string;
}
export const recentSearches = persistentAtom<RecentSearch[]>('vlr_recent_searches', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Config State
export const botPlatform = atom<string>('nightbot');
export const copyFormat = atom<'full' | 'variable' | 'url'>('full');
export const configMode = atom<string>('rank');

// Formats (detalle type 1-3) — todos persistentes para que no se pierdan al recargar
export const formatRank = persistentAtom<string>('vlr_format_rank', '1');
export const formatMatch = persistentAtom<string>('vlr_format_match', '1');
export const formatToday = persistentAtom<string>('vlr_format_today', '1');
export const formatStats = persistentAtom<string>('vlr_format_stats', '1');
export const customApiKey = persistentAtom<string>('vlr_custom_api_key', '');

/** Estilo de salida: frase default, limpio o plantilla editable */
export const outputStyle = atom<'default' | 'clean' | 'custom'>('default');
export const templateRank = atom<string>('{rank}');
export const templateMatch = atom<string>('{map} · {agent} · {rr}');
export const templateToday = atom<string>('{wins}W {losses}L · {rr} RR');
export const templateStats = atom<string>('{winrate}% WR · {agent} · {hs}% HS');

// Translations Map
export const translations: Record<string, Record<string, string>> = {
  es: {
    subtitle: "Rango, Historial y Comandos para Streamers",
    searchTitle: "Empieza la búsqueda",
    searchDesc: "Encuentra tu rango y estadísticas por Riot ID y Tag",
    region: "Región",
    namePlaceholder: "Jugador",
    tagPlaceholder: "Ej: 1234",
    searchBtn: "BUSCAR ESTADÍSTICAS",
    searchingBtn: "BUSCANDO...",
    lastMatch: "Última Partida",
    rank: "RANGO",
    match: "PARTIDA",
    today: "HOY",
    stats: "STATS",
    format: "Detalle",
    outputStyle: "Estilo de mensaje",
    styleDefault: "Frase (default)",
    styleClean: "Limpio",
    styleCustom: "Editable",
    templateLabel: "Plantilla",
    templateVars: "Variables",
    formatRank1: "Solo rango",
    formatRank2: "Rango + puntos",
    formatRank3: "Rango + puntos + MMR",
    formatMatch1: "Mapa + Resultado",
    formatMatch2: "Mapa + Resultado + KDA",
    formatMatch3: "Mapa + Resultado + KDA + HS%",
    formatToday1: "Básico (Ganadas/Perdidas)",
    formatToday2: "Medio (Partidas jugadas)",
    formatToday3: "Detallado (Incluye Winrate)",
    formatStats1: "Compacto",
    formatStats2: "Básico (Winrate + Agente + HS)",
    formatStats3: "Descriptivo",
    docsBtn: "Ver guía de comandos",
    recentSearches: "Búsquedas recientes",
    footerBy: "Creado por",
    footerExt: "Funciona gracias a",
    footerDisclaimer: "No afiliada a Riot Games ni a Valorant.",
    aboutModalTitle: "¿Cómo funciona esta API?",
    aboutModalDesc: "LosPerris API utiliza los datos de la ",
    aboutModalHighlight: "API no oficial de HenrikDev.",
    aboutModalFeaturesTitle: "Nuestras características adicionales:",
    aboutModalFeature1: "Widgets para OBS: Overlays transparentes, en vivo y súper ligeros para streamers.",
    aboutModalFeature2: "Formateo para Bots: Textos listos para Nightbot o StreamElements, en tu idioma.",
    aboutModalFeature3: "Caché Inteligente: Respuestas instantáneas y menor estrés al servidor original.",
    aboutModalFeature4: "Traducciones Globales: Nombres de rangos y mapas traducidos correctamente.",
    aboutModalLinkText: "Visitar el proyecto de HenrikDev",
    closeModal: "Cerrar",
    currentMmr: "MMR Actual",
    lastWin: "Última",
    heroBadge: "API en vivo · Tracker de rango",
    heroRealtime: "Tiempo real",
    heroCommands: "Comandos chat",
    heroRegion: "Multi-región",
    avgLatency: "Tiempo de Respuesta",
    realRequests: "Peticiones Totales",
    regions: "Regiones Globales",
    errorSearch: "Error al buscar jugador",
    errorConn: "Error de conexión",
    copyFormatTitle: "Formato de Copiado",
    copyFormatChat: "Para el Chat (!addcom)",
    copyFormatWeb: "Para el Panel (Web)",
    copyFormatUrl: "Solo Enlace (API)",
    previewUrl: "URL Directa de la API",
    previewVariable: "Variable para Dashboard",
    previewCommand: "Comando para el chat",
    copyBtn: "COPIAR",
    copiedBtn: "COPIADO",
    botLabel: "Bot",
    accountSummaryTitle: "Resumen de Cuenta",
    accountSummaryDesc: "Estadísticas y rango en tiempo real",
    generatorTitle: "Generador de Comandos",
    generatorDesc: "Configura y copia tu comando para el chat de Twitch",
    overlayTitle: "Generador de Overlay OBS",
    overlayDesc: "Widget en vivo, personalizable y optimizado para OBS.",
    overlayBgLabel: "Estilo de Fondo",
    overlayBgGlass: "Cristal",
    overlayBgSolid: "Sólido",
    overlayBgNone: "Transparente (Sin fondo)",
    overlaySizeLabel: "Tamaño",
    overlaySizeSmall: "Pequeño",
    overlaySizeNormal: "Normal",
    overlaySizeLarge: "Grande",
    overlayCopyBtn: "COPIAR URL PARA OBS",
    overlayCopiedBtn: "¡URL COPIADA!",
    overlayPreview: "Vista Previa del Widget",
  },
  en: {
    subtitle: "Rank, Match History and Streamer Commands",
    searchTitle: "Start searching",
    searchDesc: "Find your rank and statistics by Riot ID and Tag",
    region: "Region",
    namePlaceholder: "Player",
    tagPlaceholder: "Ex: 1234",
    searchBtn: "SEARCH STATISTICS",
    searchingBtn: "SEARCHING...",
    lastMatch: "Last Match",
    rank: "RANK",
    match: "MATCH",
    today: "TODAY",
    stats: "STATS",
    format: "Detail",
    outputStyle: "Message style",
    styleDefault: "Sentence (default)",
    styleClean: "Clean",
    styleCustom: "Editable",
    templateLabel: "Template",
    templateVars: "Variables",
    formatRank1: "Rank only",
    formatRank2: "Rank + RR",
    formatRank3: "Rank + RR + MMR",
    formatMatch1: "Map + Result",
    formatMatch2: "Map + Result + KDA",
    formatMatch3: "Map + Result + KDA + HS%",
    formatToday1: "Basic (Wins/Losses)",
    formatToday2: "Medium (Matches played)",
    formatToday3: "Detailed (Includes Winrate)",
    formatStats1: "Compact",
    formatStats2: "Basic (Winrate + Agent + HS)",
    formatStats3: "Descriptive",
    docsBtn: "View command guide",
    recentSearches: "Recent searches",
    footerBy: "Created by",
    footerExt: "Powered by",
    footerDisclaimer: "Not affiliated with Riot Games or Valorant.",
    aboutModalTitle: "How does this API work?",
    aboutModalDesc: "LosPerris API uses data from ",
    aboutModalHighlight: "HenrikDev's unofficial API.",
    aboutModalFeaturesTitle: "Our additional features:",
    aboutModalFeature1: "OBS Widgets: Transparent, live and super lightweight overlays for streamers.",
    aboutModalFeature2: "Bot Formatting: Ready-to-use texts for Nightbot or StreamElements in your language.",
    aboutModalFeature3: "Smart Cache: Instant responses and less stress on the original server.",
    aboutModalFeature4: "Global Translations: Rank and map names properly translated.",
    aboutModalLinkText: "Visit HenrikDev's project",
    closeModal: "Close",
    currentMmr: "Current MMR",
    lastWin: "Last Match",
    heroBadge: "Live API · Rank Tracker",
    heroRealtime: "Real-time",
    heroCommands: "Chat commands",
    heroRegion: "Multi-region",
    avgLatency: "Response Time",
    realRequests: "Total Requests",
    regions: "Global Regions",
    errorSearch: "Error searching player",
    errorConn: "Connection error",
    copyFormatTitle: "Copy Format",
    copyFormatChat: "For Chat (!addcom)",
    copyFormatWeb: "For Web Panel",
    copyFormatUrl: "URL Only (API)",
    previewUrl: "Direct API URL",
    previewVariable: "Dashboard Variable",
    previewCommand: "Chat command",
    copyBtn: "COPY",
    copiedBtn: "COPIED",
    botLabel: "Bot",
    accountSummaryTitle: "Account Summary",
    accountSummaryDesc: "Real-time stats and rank",
    generatorTitle: "Command Generator",
    generatorDesc: "Configure and copy your Twitch chat command",
    overlayTitle: "OBS Overlay Generator",
    overlayDesc: "Live, customizable widget optimized for OBS.",
    overlayBgLabel: "Background Style",
    overlayBgGlass: "Glass",
    overlayBgSolid: "Solid",
    overlayBgNone: "Transparent (No background)",
    overlaySizeLabel: "Size",
    overlaySizeSmall: "Small",
    overlaySizeNormal: "Normal",
    overlaySizeLarge: "Large",
    overlayCopyBtn: "COPY OBS URL",
    overlayCopiedBtn: "URL COPIED!",
    overlayPreview: "Widget Preview",
  }
};


