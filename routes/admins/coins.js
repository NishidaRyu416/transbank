var express = require('express');
var models = require('../../models');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.coins.findAll().then(coins => {
        res.send(coins)
    })
});
router.get('/:contractAddress', async function (req, res, next) {
    const coin = await models.coins.findOne({ where: { contractAddress: req.params.contractAddress } })
    res.send(coin)
});
router.get('/new', function (req, res, next) {
    const { name, minimalConfirmations, fee, contractAddress } = req.query
    models.coins.create({
        name: name,
        minimalConfirmations: minimalConfirmations,
        fee: fee,
        contractAddress: contractAddress
    }).then(coin => {
        res.send(coin)
    });
});
module.exports = router;