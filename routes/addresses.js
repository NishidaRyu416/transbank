var express = require('express');
var router = express.Router();
var bg = require('bignumber.js');
var models = require('../models');
const uuidv4 = require('uuid/v4');
var address_service = require('../services/address_service')

router.get('/new', function (req, res, next) {
    console.log({ wallet_id: req.query.wallet_id })
    var { address, private_key } = address_service.create_new_address(req.query.currency)
    models.addresses
        .create(
            {
                walletId: req.query.wallet_id,
                currency: req.query.currency,
                address: address,
                private_key: private_key
            }
        )
        .then(address => {
            res.send(address)
        });

});

router.get('/:id', function (req, res, next) {
    models.addresses.findOne({ where: { uuid: req.params.id } }).then(address => { res.send({ address: address, key: decrypt(address.private_key) }) });
});

router.get('/', function (req, res, next) {
    models.addresses.findAll().then(addresses => {
        res.send(addresses);
    });
});
module.exports = router;
