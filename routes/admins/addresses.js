var express = require('express');
var models = require('../../models');
var router = express.Router();
router.get('/', function (req, res, next) {
    models.transactions.findAll().then(addresses => {
        res.send(addresses)
    })
});
module.exports = router;