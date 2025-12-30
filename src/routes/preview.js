const express = require('express');
const router = express.Router();
const previewController = require('../controllers/previewController');

router.post('/', previewController.generatePreview);

module.exports = router;
