const LANG_RANK_MAPS: Record<string, Map<string, string>> = {
    es: new Map([
        ['Iron', 'Hierro'], ['Bronze', 'Bronce'], ['Silver', 'Plata'],
        ['Gold', 'Oro'], ['Platinum', 'Platino'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Inmortal'], ['Radiant', 'Radiante']
    ]),
    pt: new Map([
        ['Iron', 'Ferro'], ['Bronze', 'Bronze'], ['Silver', 'Prata'],
        ['Gold', 'Ouro'], ['Platinum', 'Platina'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Imortal'], ['Radiant', 'Radiante']
    ])
};

export function translateRank(rankName: string, lang: string): string {
    if (lang === 'en' || !rankName) return rankName;

    const map = LANG_RANK_MAPS[lang];
    if (!map) return rankName;

    // Los rangos de Valorant siempre son "Nombre Número" (ej: "Iron 1", "Gold 3")
    // Extraemos solo el nombre base para hacer la búsqueda eficiente con Map.get()
    const baseName = rankName.split(' ')[0];
    const translation = map.get(baseName);
    return translation ? rankName.replace(baseName, translation) : rankName;
}
