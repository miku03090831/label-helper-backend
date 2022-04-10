var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');

/* GET home page. */

router.post('/register',user.UserRegister);
router.post('/login',user.UserLogin);

module.exports = router;