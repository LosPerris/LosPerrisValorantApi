import express, { Application, Request, Response } from 'express';
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

const publicPath = path.join(process.cwd(), 'public');
const distPublicPath = path.join(process.cwd(), 'dist/public');
const staticOptions = { extensions: ['html'] };


// Configuración de estáticos con prefijo (Producción Vercel)
app.use('/api/valorant', express.static(publicPath, staticOptions));
app.use('/api/valorant', express.static(distPublicPath, staticOptions));

// Configuración de estáticos sin prefijo (Fallback)
app.use(express.static(publicPath, staticOptions));
app.use(express.static(distPublicPath, staticOptions));

// Riot Verification product.html/riot.txt
app.get('/product.html/riot.txt', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'riot.txt'));
});



// Limitador de peticiones solo para las rutas de la API, no para los archivos estáticos
app.use(limiter);

// Rutas de la API (Suelen ir con el prefijo /api/valorant en el cliente)
// Pero Express puede manejarlas con o sin prefijo si las montamos bien.
const registerRoutes = (prefix: string) => {
    app.use(`${prefix}/rank`, rankRoutes);
    app.use(`${prefix}/match`, matchRoutes);
    app.use(`${prefix}/history`, historyRoutes);
    app.use(`${prefix}/summary`, summaryRoutes);
    app.use(`${prefix}/preview`, previewRoutes);
};

registerRoutes('/api/valorant');
registerRoutes(''); // Fallback para desarrollo local (dev server sin prefijo)



export default app;
