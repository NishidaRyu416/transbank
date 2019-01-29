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

router.get('/:uuid', function (req, res, next) {
    models.wallets.findOne({ where: { uuid: req.params.uuid }, include: [models.addresses] }).then(wallet => {
        res.send({ wallet: wallet })
    });
});

router.get('/:uuid/new_address', function (req, res, next) {
    wallet = models.wallets.findOne({ where: { uuid: req.params.uuid } }).then(wallet => {
        const { address, private_key } = address_service.create_new_address(wallet.currency)
        models.addresses.create({
            walletId: wallet.id,
            currency: wallet.currency,
            address: address,
            private_key: private_key //this is encrypted.
        }).then(address => {
            res.send(address)
        });
    });
});

router.get('/:uuid/send', function (req, res, next) {
    models.wallets.findOne({ where: { uuid: req.params.uuid } }).then(wallet => {
        models.transactions.create({
            walletId: wallet.id,
            currency: wallet.currency,
            amount: req.query.amount,
            address: req.query.address,
            category: 'send'
        }).then(transaction => {
            res.send(transaction);
        })
    });
});



router.get('/', function (req, res, next) {
    models.wallets.findAll().then(wallets => { res.send(wallets) });
});

module.exports = router;