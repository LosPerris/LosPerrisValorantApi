const valorantService = require('../services/valorantService');
const formatService = require('../services/formatService');
const { handleRouteError } = require('../utils/helpers');

const getHistory = async (req, res) => {
    const { region } = req.params;
    const { puuid } = req;

    try {
        const historyData = await valorantService.getMMRHistoryByPUUID(region, puuid);

        if (historyData.status === 200) {
            const formattedHistory = formatService.formatHistoryData(historyData);

            res.json({
                status: 200,
                data: formattedHistory
            });
        } else {
            res.status(historyData.status).json(historyData);
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
};

module.exports = { getHistory };
