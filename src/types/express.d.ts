import 'express';

import { ValorantAccount, ValorantApiResponse } from './valorant';

declare global {
    namespace Express {
        interface Request {
            accountData?: ValorantApiResponse<ValorantAccount>;
            puuid?: string;
        }
    }
}
