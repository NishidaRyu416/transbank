var express = require('express');
var models = require('../models');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.Transactions.findAll.then(trnasactions =>{
        res.send(transactions);
    });
});

router.get('',function(req, res, next){
    
});
module.exports = router;