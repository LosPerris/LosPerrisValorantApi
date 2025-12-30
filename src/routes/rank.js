const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');
const { commonValidations } = require('../middleware/validators');
const { withAccountData } = require('../middleware/accountLoader');

router.get('/:region/:name/:tag', commonValidations, withAccountData, rankController.getRank);

module.exports = router;
