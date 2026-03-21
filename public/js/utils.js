function getCommandSyntax(platform, url) {
    switch (platform) {
        case 'nightbot':
            return `$(urlfetch ${url})`;
        case 'streamelements':
            return `\${customapi.${url}}`;
        case 'botrix':
            return `$(urlfetch ${url})`;
        case 'fossabot':
            return `$(customapi ${url})`;
        case 'streamlabs':
            return `{readapi.${url}}`;
        default:
            return url;
    }
}

const RANK_NAMES_MAP = new Map([
    ['Iron', 'Hierro'],
    ['Bronze', 'Bronce'],
    ['Silver', 'Plata'],
    ['Gold', 'Oro'],
    ['Platinum', 'Platino'],
    ['Diamond', 'Diamante'],
    ['Ascendant', 'Ascendente'],
    ['Immortal', 'Inmortal'],
    ['Radiant', 'Radiante']
]);

function formatRankName(rankName, lang) {
    if (lang !== 'es' || !rankName) return rankName;
    for (const [eng, esp] of RANK_NAMES_MAP) {
        if (rankName.includes(eng)) return rankName.replace(eng, esp);
    }
    return rankName;
}

function formatMatchResult(isWin, lang) {
    if (lang === 'es') {
        return isWin ? 'VICTORIA' : 'DERROTA';
    }
    return isWin ? 'VICTORY' : 'DEFEAT';
}
