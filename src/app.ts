import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import rankRoutes from './routes/rank';
import matchRoutes from './routes/match';
import historyRoutes from './routes/history';
import previewRoutes from './routes/preview';
import summaryRoutes from './routes/summary';


const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

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
            connectSrc: ["'self'", "https://api.henrikdev.xyz", "https://valorant-api.com", "https://unpkg.com"],
            objectSrc: ["'none'"]
        }
    }
}));
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            status: 429,
            error: 'RATE_LIMIT',
            message: 'Too many requests, please try again later.'
        });
    }
});

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith('/api/valorant')) {
        req.url = req.url.replace('/api/valorant', '') || '/';
    }
    next();
});

// Riot Verification product.html/riot.txt
app.get('/product.html/riot.txt', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/riot.txt'));
});

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

// Limitador de peticiones solo para las rutas de la API, no para los archivos estáticos
app.use(limiter);

app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);
app.use('/history', historyRoutes);
app.use('/summary', summaryRoutes);
app.use('/preview', previewRoutes);


export default app;
