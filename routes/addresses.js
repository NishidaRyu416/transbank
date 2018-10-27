var express = require('express');
var router = express.Router();
var bg = require('bignumber.js');
var models = require('../models');
var lsk = require('../coins/lsk');
//var xrp = require('../coins/xrp');

router.get('/new', function (req, res, next) {
    if (req.query.currency === 'btc') { secret_key = ''; }

    if (req.query.currency === 'xrp') {
    }

    if (req.query.currency === 'lsk') {
        var { address, passphrase } = lsk.create_account();
        models.addresses
            .create(
                {
                    currency: 'lsk',
                    address: address,
                    private_key: passphrase
                })
            .then(address => {
                res.send(address)
            });
    }
});

router.get('/:id', function (req, res, next) {
    models.Addresses.findOne({ where: { uuid: req.params.id } }).then(address => { res.send(address) });
});

router.get('/', function (req, res, next) {
    models.Addresses.findAll().then(addresses => {
        res.send(addresses);
    });
});
module.exports = router;
