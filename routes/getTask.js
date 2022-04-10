var express = require('express');
var router = express.Router();
var getTask = require('../controllers/getTaskController');

router.post('/getTaskList',getTask.getTaskList);
router.post('/getCertainTask',getTask.getCertainTask)
router.post('/getCertainTags',getTask.getCertainTags)
router.post('/getCertainPics',getTask.getCertainPics)
router.post('/getMyRecTaskList',getTask.getMyRecTaskList)
router.post('/getMyPubTaskList',getTask.getMyPubTaskList)
router.get('/getRes',getTask.getRes);
module.exports = router;