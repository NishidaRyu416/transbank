var express = require('express');
var models = require('../../models');
var router = express.Router();
router.get('/', function (req, res, next) {
    models.wallets.findAll().then(wallets => {
        res.send(wallets)
    })
});
module.exports = router;