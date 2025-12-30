const valorantService = require('../services/valorantService');

function getErrorMsg(status, lang) {
    const isEs = lang === 'es';
    switch (status) {
        case 404: return isEs ? 'Jugador no encontrado' : 'Player not found';
        case 429: return isEs ? 'Demasiadas peticiones' : 'Rate limit exceeded';
        case 500: return isEs ? 'Error del servidor' : 'Server error';
        default: return isEs ? 'Error desconocido' : 'Unknown error';
    }
}

async function withAccountData(req, res, next) {
    const { name, tag } = req.params;

    try {
        const accountData = await valorantService.getPUUID(name, tag);

        if (accountData.status !== 200) {
            const lang = req.query.lang || 'en';
            if (req.query.format === 'text') {
                return res.send(`Error: ${getErrorMsg(accountData.status, lang)}`);
            }
            return res.status(accountData.status).json(accountData);
        }

        req.accountData = accountData;
        req.puuid = accountData.data.puuid;
        next();
    } catch (error) {
        console.error('Account Loader Error:', error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Internal Server Error' });
    }
}

module.exports = { withAccountData };
