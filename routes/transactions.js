var express = require('express');
var models = require('../models');
var router = express.Router();
const axios = require('axios')
router.get('/', function (req, res, next) {
    models.transactions.findAll().then(transactions => {
        res.send(transactions);
    })
});

router.get('/getByAddress', function (req, res, next) {
    axios.get("https://testnet.blockexplorer.com/api/addr/" + "n3qWznMoJVYuPb88XuLwP3PuQ4PTuz9xoG" + '/utxo')
        .then(data => {
            let utxos = []
            data.data.forEach(utxo => {
                utxos.push(utxo)
            });
            res.send(utxos)
        })
        .catch(error => res.send(error))
});
module.exports = router;