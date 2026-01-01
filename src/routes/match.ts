import express, { Router } from 'express';
import { getLastMatch } from '../controllers/matchController';
import { commonValidations } from '../middleware/validators';
import { withAccountData } from '../middleware/accountLoader';

const router: Router = express.Router();

router.get('/last/:region/:name/:tag', commonValidations, withAccountData, getLastMatch);

export default router;
