var express = require('express');
var router = express.Router();
var bg = require('bignumber.js');
var models = require('../models');
var address_service = require('../services/address_service')
var request = require('request');
var bitcore = require('bitcore-lib');
var security_service = require('../services/security_service')



require('dotenv').config();

router.get('/new', function (req, res, next) {

    models.wallets.findOne({ where: { uuid: req.query.wallet_id } }).then(wallet => {
        var { address, private_key } = address_service.create_new_address(wallet.currency)
        models.addresses.create(
            {
                walletId: wallet.id,
                currency: wallet.currency,
                address: address,
                private_key: private_key
            }
        ).then(address => {
            res.send(address)
        });
    }).catch(error => { console.log(error) });
});

router.get('/:id/send', function (req, res, next) {
    models.addresses.findOne({ where: { uuid: req.params.id } }).then(address => {
        a = address_service.transfer(address.currency, address.address, bg('5'), address.private_key, address.address)
        res.send(a)
    });
});

router.get('/:id/get_balance', function (req, res, next) {
    models.addresses.findOne({ where: { uuid: req.params.id } }).then(address => {

        if (address.currency === 'btc') {
            insight.address(address.address, function (e, info) {
                if (e) {
                    console.log(e)
                }
                else {
                    json = JSON.stringify({
                        'balance': info.balance
                    });
                    res.send(json)
                }
            });
        }
        if (address.currency === 'bch') {

        }
        if (address.currency === 'ltc') {

        }
    });
});

/*
The code below simply allows users to get utxos by just specifying a uuid of an address.
@param uuid.
@response balance, txid.
*/
router.get('/:id/get_utxos', function (req, res, next) {
    models.addresses.findOne({ where: { uuid: req.params.id } }).then(address => {
        if (address.currency === 'btc') {
            request(process.env.BTC_UTXO_URL + address.address + '/utxo',
                function (error, response) {
                    if (error) {

                    } else {
                        var txid = [];
                        amount = new bg('0');
                        JSON.parse(response.body).forEach(utxo => {
                            amount = amount.plus(utxo.amount);
                            txid.push(utxo.txid);
                        });
                        res.send({ amount: amount, txids: txid });
                    }
                });
        }

        if (address.currency === 'bch') {

        }

        if (address.currency === 'ltc') {

        }
    });
});

/*
*/
router.get('/get_utxos', function (req, res, next) {
    var vout = [];
    var txid = [];
    amount = new bg('0');
    request(process.env.BTC_UTXO_URL + req.query.address + '/utxo',
        function (error, response) {
            if (error) {

            } else {
                JSON.parse(response.body).forEach(utxo => {
                    amount = amount.plus(utxo.amount);
                    txid.push(utxo.txid);
                    vout.push(utxo.vout)
                });
                res.send({ vout: vout, amount: amount, txid: txid });
            }
        });
});


router.get('/select_utxo', function (req, res, next) {
    var amount = 0;
    var private_key = '';

    models.addresses.findAll().then(addresses => {
        addresses.some(address => {
            request(process.env.BTC_UTXO_URL + address.address + '/utxo',
                function (error, utxos) {
                    if (error) {

                    }
                    else {
                        var coinSelect = require('coinselect')
                        var feeRate = 55

                        let targets = [
                            {
                                address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
                                value: 1993081
                            }
                        ]
                        utxos = JSON.parse(utxos.body)

                        utxos.forEach(utxo => {
                            utxo.value = utxo.satoshis
                        })

                        console.log(utxos)


                        var { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate)

                        if (inputs != null && outputs != null) {
                            private_key = new bitcore.PrivateKey(security_service.decrypt(address.private_key), bitcore.Networks.testnet);

                            console.log(private_key)

                            res.send({ inputs: inputs, outputs: outputs, fee: fee })
                            return true
                        }

                    }
                });
        })


    });

})


router.get('/:id', function (req, res, next) {
    models.addresses.findOne({ where: { uuid: req.params.id } }).then(address => {
        res.send(address)
    });
});

router.get('/', function (req, res, next) {
    models.addresses.findAll().then(addresses => {
        res.send(addresses);
    });
});

module.exports = router;
