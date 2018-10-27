var express = require('express');
var models = require('../models');
var router = express.Router();
var BigNumber = require('bignumber.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
  var first = req.query.first;
  var second = req.query.second;
  b = BigNumber(first)
  a = BigNumber(second)
  b = b.plus(a)
  res.send({ "data": b });
});

router.get('/new', function (req, res, next) {
  models.Wallets.create({
    currency: req.query.currency
  }).then(wallet => {
    res.send({ wallet })
  });
});
router.get('/:id', function (req, res, next) {
  models.Wallets.find({ uuid: req.query.id }).then(wallet => {
    res.send({ wallet });
  });
});
module.exports = router;
