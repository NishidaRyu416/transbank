var express = require('express');
var models = require('../models');
const coin_service = require('../services/coin_service');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.coins.findAll().then(coins => {
        res.send(coins)
    })
});
router.get('/isSupported', async function (req, res, next) {
    const { name, contractAddress } = req.query
    if (contractAddress) {
        const isSupported = await coin_service.isSupportedByContractAddress(contractAddress)
        res.send(isSupported)
    } else if (name) {
        const isSupported = await coin_service.isSupportedByName(name)
        res.send(isSupported)
    }
    else {
        res.send('You have to specify the name of a coin/token or the contractAddress of a token')
    }
})
router.get('/names', async function (req, res, next) {
    const names = await coin_service.getAllSupportedCoinsNames()
    res.send(names)
})
router.get('/:contractAddress', async function (req, res, next) {
    const coin = await models.coins.findOne({ where: { contractAddress: req.params.contractAddress } })
    res.send(coin)
});
router.get('/getInfo', async function (req, res, next) {
    const { contractAddress, name } = req.query
    console.log(name)
    if (name) {
        const coin = await coin_service.getByName(name)
        res.send(coin)
    }
    else if (contractAddress) {
        const coin = await coin_service.getTokenBycontractAddress(contractAddress)
        res.send(coin)
    }
})
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