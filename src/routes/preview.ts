import express, { Router } from 'express';
import { generatePreview } from '../controllers/previewController';

const router: Router = express.Router();

router.post('/', generatePreview);

export default router;
