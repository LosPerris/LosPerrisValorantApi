import express, { Router } from 'express';
import { generatePreview, validatePreview } from '../controllers/previewController';

const router: Router = express.Router();

router.post('/', validatePreview, generatePreview);

export default router;
