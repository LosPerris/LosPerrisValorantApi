const valorantService = require('../services/valorantService');
const formatService = require('../services/formatService');
const { handleRouteError, sendResponse } = require('../utils/helpers');

const getRank = async (req, res) => {
    const { region } = req.params;
    const { accountData, puuid } = req;

    try {
        const mmrData = await valorantService.getMMRByPUUID(region, puuid);

        if (mmrData.status === 200) {
            const formattedData = formatService.formatRankData(accountData, mmrData);
            sendResponse(req, res, formattedData, formatService.formatRankText);
        } else {
            if (req.query.format === 'text') {
                return res.send(`Error: ${mmrData.message || 'Could not fetch rank'}`);
            }
            res.status(mmrData.status).json(mmrData);
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
};

module.exports = { getRank };
