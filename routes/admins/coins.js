var express = require('express');
var models = require('../../models');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.coins.findAll().then(coins => {
        res.send(coins)
    })
});

router.get('/new', function (req, res, next) {
    const { name, minimalConfirmations, fee, contractAddress } = req.query
    models.coins.create({
        name: name,
        minimalConfirmations: minimalConfirmations,
        fee: fee,
        contractAddress: contractAddress
    }).then(coin => {
        res.send({ coin })
    });
});
module.exports = router;