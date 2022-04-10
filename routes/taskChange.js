var express = require('express');
var router = express.Router();
var taskChange = require('../controllers/taskChangeController');

router.post('/receiveTask',taskChange.receiveTask);
router.post('/finishTask',taskChange.finishTask);
router.post('/storeResult',taskChange.storeResult);

module.exports = router;