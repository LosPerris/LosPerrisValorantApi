const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { commonValidations } = require('../middleware/validators');
const { withAccountData } = require('../middleware/accountLoader');

router.get('/:region/:name/:tag', commonValidations, withAccountData, historyController.getHistory);

module.exports = router;
