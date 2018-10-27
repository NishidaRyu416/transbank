// This command is for withdrawing.
// This can only be proccessed once per hour for a security reason.

var models = require('../models');
var BigNumber = require('bignumber.js');
var lsk = require('/lib/lisk.js')
var xrp = require('/lib/xrp.js')

function withdraw() {
    models.Transactions.findAll({ where: { proccessed: false } })
        .then(transactions => {
            transactions.forEach(transaction => {
                if (transaction.get('cuurency') === 'btc') {


                } if (transaction.get('currency') === 'xrp') {

                } if (transaction.get('currency') === 'lsk') {
                    // trnasfer(amount, address, passphrase)
                    // In lisk, passpharses are considered to be private keys
                    lsk.transfer(transaction.get('amount'), transaction.get('address'), models.Wallets.findOne.get('private_key'))
                }
                transaction.get('address')
            });
        })
}

