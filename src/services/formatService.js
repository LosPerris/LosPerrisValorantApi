const { translateRank } = require('../utils/helpers');
const { MAP_UUIDS } = require('../utils/constants');


function formatRankData(accountData, mmrData) {
    const currentData = mmrData.data.current_data;
    return {
        name: accountData.data.name,
        tag: accountData.data.tag,
        puuid: accountData.data.puuid,
        region: accountData.data.region,
        rank: currentData.currenttierpatched,
        rank_image: currentData.images.large,
        elo: currentData.elo,
        mmr_change: currentData.mmr_change_to_last_game,
        ranking_in_tier: currentData.ranking_in_tier,
        card: accountData.data.card
    };
}

function formatMatchData(matchData, puuid) {
    const stats = matchData.players.all_players.find(p => p.puuid === puuid);
    if (!stats) return null;

    const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
    const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

    const agentName = stats.character;
    const agentIcon = stats.assets.agent.small;
    const agentImage = stats.assets.agent.bust || stats.assets.agent.full || agentIcon;

    const mapName = matchData.metadata.map;
    const mapUuid = MAP_UUIDS[mapName];
    const mapImage = mapUuid ? `https://media.valorant-api.com/maps/${mapUuid}/splash.png` : null;

    const isWin = matchData.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');
    const kda = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;


    return {
        ...matchData,
        derived: {
            is_win: isWin,
            kda: kda,
            hs_percent: hsPercentage,
            agent_name: agentName,
            agent_icon: agentIcon,
            agent_image: agentImage,
            map_image: mapImage,
            map_name: mapName
        }
    };
}

function formatHistoryData(historyData) {
    return historyData.data.map(match => ({
        date: match.date,
        elo: match.elo,
        change: match.mmr_change_to_last_game,
        map: match.map.name
    })).reverse();
}

function formatRankText(data, lang, type) {
    const { rank, ranking_in_tier, elo, name, tag } = data;
    const user = `${name}#${tag}`;
    const rr = ranking_in_tier;

    const isEs = lang === 'es';
    const translatedRank = translateRank(rank, lang);

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `Currently I am in ${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Currently I am in ${translatedRank} with ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `Currently I am in ${translatedRank} with ${rr} RR, my mmr is ${elo}`;

    return `${user}: ${translatedRank} - ${rr} RR`;
}

function formatMatchText(data, lang, type, mmrChange) {
    const { derived } = data;
    const { map_name, is_win, kda, hs_percent, agent_name } = derived;

    const change = mmrChange !== undefined ? mmrChange : (data.mmr_change || 0);

    const isEs = lang === 'es';

    if (isEs) {
        const resultVerb = is_win ? 'gané' : 'perdí';
        const pointsMsg = `${change} puntos`;

        if (type === '1') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hs_percent}% HS`;

        return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    const resultVerb = is_win ? 'won' : 'lost';
    const pointsMsg = `${change} RR`;

    if (type === '1') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg}`;
    if (type === '2') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}`;
    if (type === '3') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}, my HS percentage was ${hs_percent}%`;

    return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
}

module.exports = {
    formatRankData,
    formatMatchData,
    formatHistoryData,
    formatRankText,
    formatMatchText
};
