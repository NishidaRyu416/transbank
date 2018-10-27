var express = require('express');
var models = require('../models');
var router = express.Router();
var bg = require('bignumber.js');

router.get('/new', function (req, res, next) {
    models.wallets.create({ currency: req.query.currency }).then(wallet => {
        res.send({ wallet })
    });
});

router.get('/:id', function (req, res, next) {
    console.log(req)
    models.wallets.findOne({ where: { uuid: req.params.id } }).then(wallet => {
        res.send(wallet)
    });
});

router.get('/:id/send', function (req, res, next) {
    models.transactions.create({
        currency: req.params.id,
        amount: req.query.amount,
        address: req.query.address,
        category: 'send'
    });
})



router.get('/', function (req, res, next) {
    models.Wallets.findAll().then(wallets => { res.send(wallets) });
});
module.exports = router;