var models = require('../models');
var minimum_confirmations = ['btc',5, 'lsk',10,'xrp',5]

models.Transactions.create({
    currency:currency,
    txid:txid,
    amount:amount,
    confirmations:confirmations,
    address:address,
    if(confirmations >= minimum_confirmations[currency]){
        confirmed:true, 
    }
    category:'receive'
});

