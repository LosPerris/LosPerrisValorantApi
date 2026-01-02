import 'express';

declare global {
    namespace Express {
        interface Request {
            accountData?: any;
            puuid?: string;
        }
    }
}
