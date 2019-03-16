var express = require('express');
var router = express.Router();
router.use('/coins', require('./coins'));
router.use('/transactions', require('./transactions'))
router.use('/wallets', require('./wallets'))
router.use('/addresses', require('./addresses'))
router.use('/txErrors', require('./txErrors'))
module.exports = router;