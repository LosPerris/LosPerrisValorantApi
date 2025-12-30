const valorantService = require('../services/valorantService');
const formatService = require('../services/formatService');
const { handleRouteError, sendResponse } = require('../utils/helpers');

const getLastMatch = async (req, res) => {
    const { region } = req.params;
    const { accountData, puuid } = req;

    try {
        const [matchesData, mmrData] = await Promise.all([
            valorantService.getMatchesByPUUID(region, puuid, 'competitive'),
            valorantService.getMMRByPUUID(region, puuid)
        ]);

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            const formattedData = formatService.formatMatchData(lastMatch, puuid);

            const mmrChange = (mmrData.status === 200) ? mmrData.data.current_data.mmr_change_to_last_game : 0;

            sendResponse(req, res, formattedData, formatService.formatMatchText, mmrChange);
        } else {
            if (req.query.format === 'text') {
                return res.send('No matches found');
            }
            res.status(matchesData.status).json({
                status: matchesData.status,
                message: 'No matches found or error fetching matches',
                data: matchesData.data
            });
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
};

module.exports = { getLastMatch };
