import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import rankRoutes from './routes/rank';
import matchRoutes from './routes/match';
import historyRoutes from './routes/history';
import previewRoutes from './routes/preview';
import summaryRoutes from './routes/summary';


const app: Application = express();

app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://media.valorant-api.com"],
            connectSrc: ["'self'", "https://api.henrikdev.xyz", "https://valorant-api.com"],
            objectSrc: ["'none'"]
        }
    }
}));
app.use(cors());
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith('/api/valorant')) {
        req.url = req.url.replace('/api/valorant', '') || '/';
    }
    next();
});

// Riot Verification product.html/riot.txt
app.get('/product.html/riot.txt', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/riot.txt'));
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);
app.use('/history', historyRoutes);
app.use('/summary', summaryRoutes);
app.use('/preview', previewRoutes);


export default app;
