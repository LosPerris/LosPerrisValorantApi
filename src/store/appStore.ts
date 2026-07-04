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
export const configMode = atom<string>('rank');

// Formats
export const formatRank = atom<string>('1');
export const formatMatch = atom<string>('1');
export const formatToday = atom<string>('1');
export const formatStats = atom<string>('1');

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
    format: "Formato",
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
    docsTitle: "Documentación de la API",
    docsDesc: "Renovamos la documentación: explora y prueba cada endpoint de forma interactiva directo desde el navegador.",
    docsBtn: "VER DOCUMENTACIÓN COMPLETA",
    recent: "Recientes:",
    recentSearches: "Búsquedas recientes",
    copiedTooltip: "¡Copiado!",
    footerBy: "Creado por",
    footerExt: "Funciona gracias a",
    footerDisclaimer: "Riot Games no respalda ni patrocina este proyecto.",
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
    botConfigSub: "Ajusta plataforma y formato",
    commandParams: "Parámetros del comando",
    docsSub: "Explora cada endpoint",
    interactiveRef: "Referencia interactiva",
    heroBadge: "API en vivo · Tracker de rango",
    heroRealtime: "Tiempo real",
    heroCommands: "Comandos chat",
    heroRegion: "Multi-región",
    heroBtn: "Empezar búsqueda",
    avgLatency: "Latencia Media",
    realRequests: "Solicitudes Reales",
    regions: "Regiones",
    errorSearch: "Error al buscar jugador",
    errorConn: "Error de conexión",
    noMatches: "No hay partidas recientes",
    botCmdsSub: "Copia y pega en tu chat",
    readyBlock: "Bloque listo para integrar",
    points: "Puntos",
    toNext: "Ascenso",
    rankLabel: "Rango"
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
    format: "Format",
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
    docsTitle: "API Documentation",
    docsDesc: "We renewed the documentation: explore and test every endpoint interactively directly from the browser.",
    docsBtn: "VIEW FULL DOCUMENTATION",
    recent: "Recent:",
    recentSearches: "Recent searches",
    footerBy: "Created by",
    footerExt: "Powered by",
    footerDisclaimer: "Riot Games does not endorse or sponsor this project.",
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
    botConfigSub: "Adjust platform and format",
    commandParams: "Command parameters",
    docsSub: "Explore each endpoint",
    interactiveRef: "Interactive reference",
    heroBadge: "Live API · Rank Tracker",
    heroRealtime: "Real-time",
    heroCommands: "Chat commands",
    heroRegion: "Multi-region",
    heroBtn: "Start search",
    avgLatency: "Avg Latency",
    realRequests: "Real Requests",
    regions: "Regions",
    errorSearch: "Error searching player",
    errorConn: "Connection error",
    noMatches: "No recent matches",
    botCmdsSub: "Copy and paste in chat",
    readyBlock: "Ready to use block",
    points: "Points",
    toNext: "To next",
    rankLabel: "Rank"
  }
};


