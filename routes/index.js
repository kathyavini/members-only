var express = require('express');
var router = express.Router();

// Require controller modules.
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

router.get('/', messageController.home);

router.get('/new-message', messageController.new_message_get);

router.post('/new-message', messageController.new_message_post);

router.get('/sign-up', userController.sign_up_get);

router.post('/sign-up', userController.sign_up_post);

router.get('/log-in', userController.log_in_get);

router.get('/membership', userController.membership_get);

router.post('/membership', userController.membership_post);

module.exports = router;
