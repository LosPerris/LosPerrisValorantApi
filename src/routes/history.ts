import express, { Router } from 'express';
import { getHistory } from '../controllers/historyController';
import { commonValidations } from '../middleware/validators';
import { withAccountData } from '../middleware/accountLoader';

const router: Router = express.Router();

router.get('/:region/:name/:tag', commonValidations, withAccountData, getHistory);

export default router;
