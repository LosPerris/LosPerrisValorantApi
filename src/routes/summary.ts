import express, { Router } from 'express';
import { getSummary } from '../controllers/summaryController';
import { commonValidations } from '../middleware/validators';

const router: Router = express.Router();

router.get('/:region/:name/:tag', commonValidations, getSummary);

export default router;
