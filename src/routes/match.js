const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { commonValidations } = require('../middleware/validators');
const { withAccountData } = require('../middleware/accountLoader');

router.get('/last/:region/:name/:tag', commonValidations, withAccountData, matchController.getLastMatch);

module.exports = router;
