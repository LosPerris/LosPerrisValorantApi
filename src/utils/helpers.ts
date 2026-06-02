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

    for (const [eng, translated] of map) {
        if (rankName.includes(eng)) {
            return rankName.replace(eng, translated);
        }
    }
    return rankName;
}
