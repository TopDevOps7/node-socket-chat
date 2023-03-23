const express = require('express');
const router = express.Router();
const {
    myAccount,
    register,
    adminlogin,
    logout,
    loginV2,
/*
    login,
    putState,
    getState,
    retrievePasswordMailSend,
    resetPassword,
    registerMailSend,
*/
} = require('../maria_controllers/auth');
const { verifyToken } = require('../middlewares/authHandler');

router.route('/me').get(verifyToken, myAccount);
router.route('/register').post(register);
router.route('/adminlogin').post(adminlogin);
router.route('/logout').post(verifyToken, logout);
router.route('/loginV2').post(loginV2);

/*
router.route('/login').post(login);
router.route('/online-status').put(verifyToken, putState);
router.route('/online-status').get(verifyToken, getState);
router.route('/retrieve-pwd-mail-send').post(retrievePasswordMailSend);
router.route('/register-mail-send').post(registerMailSend);
router.route('/reset-password/:userId').post(resetPassword);
*/
module.exports = router;
