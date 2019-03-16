var express = require('express');
var models = require('../models');
var router = express.Router();
var address_service = require('../services/address_service')

const supportedCoins = ['btc', 'eth', 'lsk', 'hrmn', 'rep', 'usdt']

router.get('/new', function (req, res, next) {
    if (supportedCoins.includes(req.query.currency)) {
        models.wallets.create({ currency: req.query.currency }).then(wallet => {
            res.send({ wallet })
        });
    } else {
        res.send('You are making a wallet of an unspported coin.')
    }
});

router.get('/:uuid', function (req, res, next) {
    models.wallets.findOne({ where: { uuid: req.params.uuid }, include: [models.addresses] }).then(wallet => {
        res.send({ wallet })
    });
});

router.get('/:uuid/new_address', function (req, res, next) {
    wallet = models.wallets.findOne({ where: { uuid: req.params.uuid } })
        .then(wallet => {
            const { address, private_key } = address_service.create_new_address(wallet.currency)
            models.addresses.create({
                walletId: wallet.id,
                currency: wallet.currency,
                address: address,
                private_key: private_key //this is encrypted.
            })
                .then(address => {
                    res.send({ address })
                });
        })
        .catch()
});

router.get('/:uuid/send', function (req, res, next) {
    if (supportedCoins.includes(req.query.currency)) {
        models.wallets.findOne({ where: { uuid: req.params.uuid } }).then(wallet => {
            models.transactions.create({
                walletId: wallet.id,
                currency: req.query.currency,
                amount: req.query.amount,
                address: req.query.address,
                category: 'send'
            }).then(transaction => {
                res.send({ transaction });
            })
        });
    }
    else {
        res.send('You are making a sending transaction of an unspported coin.')
    }
});



router.get('/', function (req, res, next) {
    models.wallets.findAll().then(wallets => { res.send(wallets) });
});

module.exports = router;