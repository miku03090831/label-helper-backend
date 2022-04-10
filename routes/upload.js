var express = require('express');
var router = express.Router();
var task = require('../controllers/uploadController');

/* GET home page. */

router.post('/uploadImg',task.storeImg);
router.post('/createTask',task.createTask)
router.post('/createTag',task.createTag)

module.exports = router;