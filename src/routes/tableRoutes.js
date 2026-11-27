const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/status', tableController.getTableStatus);

module.exports = router;
