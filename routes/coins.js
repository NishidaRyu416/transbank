var express = require('express');
var models = require('../models');
const coin_service = require('../services/coin_service');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.coins.findAll().then(coins => {
        res.send(coins)
    })
});

router.get('/:contractAddress', function (req, res, next) {
    coin_service.getTokenBycontractAddress(toString(req.params.contractAddress)).then(coin => {
        res.send(coin)
    })
});

router.get('/getInfo', function (req, res, next) {
    const { contractAddress, name } = req.query
    console.log(contractAddress)
    if (name) {
        console.log(name)
        coin_service.getTokenByName(name).then(coin => {
            res.send(coin)
        })
    }
    else if (contractAddress) {
        coin_service.getTokenBycontractAddress(contractAddress).then(coin => {
            res.send(coin)
        })
    }
    else {
        res.send('We do not support the coin/token you search for, otherwise, there is not such one.')
    }
})
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