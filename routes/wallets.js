var express = require('express');
var models = require('../models');
var router = express.Router();
var bg = require('bignumber.js');
var address_service = require('../services/address_service')

router.get('/new', function (req, res, next) {
    models.wallets.create({ currency: req.query.currency }).then(wallet => {
        res.send({ wallet })
    });
});

router.get('/:id', function (req, res, next) {
    models.wallets.findOne({ where: { uuid: req.params.id } }).then(wallet => {
        res.send(wallet)
    });
});

router.get('/:id/get_new_address', function (req, res, next) {
    var { address, private_key } = address_service.create_new_address(req.query.currency, req.query.wallet_id)
    models.address.create({
        walletId: req.params.id,
        currency: req.query.currency,
        address: address,
        private_key: private_key

    })
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
    models.wallets.findAll().then(wallets => { res.send(wallets) });
});
module.exports = router;