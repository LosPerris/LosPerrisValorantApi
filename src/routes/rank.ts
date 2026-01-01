import express, { Router } from 'express';
import { getRank } from '../controllers/rankController';
import { commonValidations } from '../middleware/validators';
import { withAccountData } from '../middleware/accountLoader';

const router: Router = express.Router();

router.get('/:region/:name/:tag', commonValidations, withAccountData, getRank);

export default router;
