var express = require('express');
var models = require('../../models');
var router = express.Router();
router.get('/', function (req, res, next) {
    models.txErrors.findAll().then(txErrors => {
        res.send(txErrors)
    })
});
module.exports = router;