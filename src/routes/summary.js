const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { commonValidations } = require('../middleware/validators');

router.get('/:region/:name/:tag', commonValidations, summaryController.getSummary);

module.exports = router;
