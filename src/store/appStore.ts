import { atom } from 'nanostores';
import type { SummaryResponse } from '../types/valorant';

// UI State
export const hasSearched = atom<boolean>(false);
export const isLoading = atom<boolean>(false);
export const error = atom<string>('');
export const lang = atom<string>('es');

// Modal State
export const isAboutModalOpen = atom<boolean>(false);

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
export const recentSearches = atom<RecentSearch[]>([]);

// Config State
export const botPlatform = atom<string>('nightbot');
export const copyFormat = atom<'full' | 'variable' | 'url'>('full');
export const configMode = atom<string>('rank');

// Formats (detalle type 1-3)
export const formatRank = atom<string>('1');
export const formatMatch = atom<string>('1');
export const formatToday = atom<string>('1');
export const formatStats = atom<string>('1');

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
    riotId: "Riot ID",
    namePlaceholder: "Jugador",
    tagPlaceholder: "Ej: 1234",
    tag: "Tag",
    searchBtn: "BUSCAR ESTADÍSTICAS",
    searchingBtn: "BUSCANDO...",
    loading: "CARGANDO...",
    errorNotFound: "Jugador no encontrado o ID/Tag inválidos.",
    lastMatch: "Última Partida",
    botConfig: "Configuración del Bot",
    rank: "RANGO",
    match: "PARTIDA",
    today: "HOY",
    stats: "STATS",
    platform: "Plataforma",
    format: "Detalle",
    outputStyle: "Estilo de mensaje",
    styleDefault: "Frase (default)",
    styleClean: "Limpio",
    styleCustom: "Editable",
    styleDefaultHint: "Mensaje completo listo para el chat",
    styleCleanHint: "Solo el dato, sin frase",
    styleCustomHint: "Tú escribes el texto con variables",
    templateLabel: "Plantilla",
    templateVars: "Variables",
    formatRank: "Formato de Rango",
    formatRank1: "Solo rango",
    formatRank2: "Rango + puntos",
    formatRank3: "Rango + puntos + MMR",
    formatMatch: "Formato de Partida",
    formatMatch1: "Mapa + Resultado",
    formatMatch2: "Mapa + Resultado + KDA",
    formatMatch3: "Mapa + Resultado + KDA + HS%",
    formatToday: "Formato de Hoy",
    formatToday1: "Básico (Ganadas/Perdidas)",
    formatToday2: "Medio (Partidas jugadas)",
    formatToday3: "Detallado (Incluye Winrate)",
    formatStats: "Formato de Stats",
    formatStats1: "Compacto",
    formatStats2: "Básico (Winrate + Agente + HS)",
    formatStats3: "Descriptivo",
    botCmds: "Comandos del Bot",
    example: "EJEMPLO:",
    docsTitle: "Guía de comandos",
    docsDesc: "Cómo poner rango, partida y stats en tu chat sin complicarte.",
    docsBtn: "Ver guía de comandos",
    recent: "Recientes:",
    recentSearches: "Búsquedas recientes",
    copiedTooltip: "¡Copiado!",
    footerBy: "Creado por",
    footerExt: "Funciona gracias a",
    footerDisclaimer: "No afiliada a Riot Games ni a Valorant.",
    aboutModalTitle: "¿Cómo funciona esta API?",
    aboutModalDesc: "LosPerris Valorant API funciona como una extensión avanzada de la ",
    aboutModalHighlight: "API no oficial de HenrikDev.",
    aboutModalFeaturesTitle: "Lo que añadimos sobre la base:",
    aboutModalFeature1: "Rate Limiting Distribuido: Prevención de abuso global mediante Redis.",
    aboutModalFeature2: "Caché de Alta Velocidad: Respuestas ultrarrápidas y menor estrés al servidor original.",
    aboutModalFeature3: "Formateo para Bots: Textos listos para Nightbot o StreamElements, en tu idioma.",
    aboutModalFeature4: "Traducciones Globales: Nombres de rangos y mapas traducidos correctamente.",
    aboutModalLinkText: "Visitar el proyecto de HenrikDev",
    closeModal: "Cerrar",
    step1: "PASO 01",
    step2: "PASO 02",
    step3: "PASO 03",
    step4: "PASO 04",
    step5: "PASO 05",
    resultsTitle: "Resultados del jugador",
    resultsSub: "Tarjeta, resumen e historial",
    quickStats: "Resumen Rápido",
    currentMmr: "MMR Actual",
    lastWin: "Última",
    toRankUp: "A Ascenso",
    botConfigSub: "Ajusta plataforma, estilo y detalle",
    commandParams: "Parámetros del comando",
    docsSub: "Explora cada endpoint",
    interactiveRef: "Referencia interactiva",
    heroBadge: "API en vivo · Tracker de rango",
    heroRealtime: "Tiempo real",
    heroCommands: "Comandos chat",
    heroRegion: "Multi-región",
    heroBtn: "Ver cómo funciona",
    avgLatency: "Latencia media",
    realRequests: "Solicitudes Reales",
    regions: "Regiones",
    errorSearch: "Error al buscar jugador",
    errorConn: "Error de conexión",
    noMatches: "No hay partidas recientes",
    botCmdsSub: "Copia y pega en tu chat",
    readyBlock: "Bloque listo para integrar",
    points: "Puntos",
    toNext: "Ascenso",
    rankLabel: "Rango",
    copyFormatTitle: "Formato de Copiado",
    copyFormatChat: "Para el Chat (!addcom)",
    copyFormatWeb: "Para el Panel (Web)",
    copyFormatUrl: "Solo Enlace (API)",
    previewUrl: "URL Directa de la API",
    previewVariable: "Variable para Dashboard",
    previewCommand: "Comando para el chat",
    copyBtn: "COPIAR",
    copiedBtn: "COPIADO",
    exampleOutput: "Salida de ejemplo",
    botLabel: "Bot",
    accountSummaryTitle: "Resumen de Cuenta",
    accountSummaryDesc: "Estadísticas y rango en tiempo real",
    generatorTitle: "Generador de Comandos",
    generatorDesc: "Configura y copia tu comando para el chat de Twitch"
  },
  en: {
    subtitle: "Rank, Match History and Streamer Commands",
    searchTitle: "Start searching",
    searchDesc: "Find your rank and statistics by Riot ID and Tag",
    region: "Region",
    riotId: "Riot ID",
    namePlaceholder: "Player",
    tagPlaceholder: "Ex: 1234",
    tag: "Tag",
    searchBtn: "SEARCH STATISTICS",
    searchingBtn: "SEARCHING...",
    loading: "LOADING...",
    errorNotFound: "Player not found or invalid ID/Tag.",
    lastMatch: "Last Match",
    botConfig: "Bot Configuration",
    rank: "RANK",
    match: "MATCH",
    today: "TODAY",
    stats: "STATS",
    platform: "Platform",
    format: "Detail",
    outputStyle: "Message style",
    styleDefault: "Sentence (default)",
    styleClean: "Clean",
    styleCustom: "Editable",
    styleDefaultHint: "Full ready-to-chat sentence",
    styleCleanHint: "Just the data, no filler",
    styleCustomHint: "Write your own text with variables",
    templateLabel: "Template",
    templateVars: "Variables",
    formatRank: "Rank Format",
    formatRank1: "Rank only",
    formatRank2: "Rank + RR",
    formatRank3: "Rank + RR + MMR",
    formatMatch: "Match Format",
    formatMatch1: "Map + Result",
    formatMatch2: "Map + Result + KDA",
    formatMatch3: "Map + Result + KDA + HS%",
    formatToday: "Today Format",
    formatToday1: "Basic (Wins/Losses)",
    formatToday2: "Medium (Matches played)",
    formatToday3: "Detailed (Includes Winrate)",
    formatStats: "Stats Format",
    formatStats1: "Compact",
    formatStats2: "Basic (Winrate + Agent + HS)",
    formatStats3: "Descriptive",
    botCmds: "Bot Commands",
    example: "EXAMPLE:",
    docsTitle: "Command guide",
    docsDesc: "How to put rank, match and stats in your chat without the hassle.",
    docsBtn: "View command guide",
    recent: "Recent:",
    recentSearches: "Recent searches",
    footerBy: "Created by",
    footerExt: "Powered by",
    footerDisclaimer: "Not affiliated with Riot Games or Valorant.",
    aboutModalTitle: "How does this API work?",
    aboutModalDesc: "LosPerris Valorant API works as an advanced extension of ",
    aboutModalHighlight: "HenrikDev's unofficial API.",
    aboutModalFeaturesTitle: "What we add on top:",
    aboutModalFeature1: "Distributed Rate Limiting: Global abuse prevention via Redis.",
    aboutModalFeature2: "High-Speed Caching: Blazing fast responses and less stress on the original server.",
    aboutModalFeature3: "Bot Formatting: Ready-to-use texts for Nightbot or StreamElements, in your language.",
    aboutModalFeature4: "Global Translations: Rank and map names properly translated.",
    aboutModalLinkText: "Visit HenrikDev's project",
    closeModal: "Close",
    step1: "STEP 01",
    step2: "STEP 02",
    step3: "STEP 03",
    step4: "STEP 04",
    step5: "STEP 05",
    resultsTitle: "Player Results",
    resultsSub: "Card, summary and history",
    quickStats: "Quick Summary",
    currentMmr: "Current MMR",
    lastWin: "Last Match",
    toRankUp: "To Rank Up",
    botConfigSub: "Adjust platform, style and detail",
    commandParams: "Command parameters",
    docsSub: "Explore each endpoint",
    interactiveRef: "Interactive reference",
    heroBadge: "Live API · Rank Tracker",
    heroRealtime: "Real-time",
    heroCommands: "Chat commands",
    heroRegion: "Multi-region",
    heroBtn: "See how it works",
    avgLatency: "Avg latency",
    realRequests: "Real Requests",
    regions: "Regions",
    errorSearch: "Error searching player",
    errorConn: "Connection error",
    noMatches: "No recent matches",
    botCmdsSub: "Copy and paste in chat",
    readyBlock: "Ready to use block",
    points: "Points",
    toNext: "To next",
    rankLabel: "Rank",
    copyFormatTitle: "Copy Format",
    copyFormatChat: "For Chat (!addcom)",
    copyFormatWeb: "For Web Panel",
    copyFormatUrl: "URL Only (API)",
    previewUrl: "Direct API URL",
    previewVariable: "Dashboard Variable",
    previewCommand: "Chat command",
    copyBtn: "COPY",
    copiedBtn: "COPIED",
    exampleOutput: "Example output",
    botLabel: "Bot",
    accountSummaryTitle: "Account Summary",
    accountSummaryDesc: "Real-time stats and rank",
    generatorTitle: "Command Generator",
    generatorDesc: "Configure and copy your Twitch chat command"
  }
};


