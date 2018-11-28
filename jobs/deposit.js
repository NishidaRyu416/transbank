var models = require('../models');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight('testnet');
var minimum_confirmations = { 'btc': 5, 'lsk': 10, 'xrp': 5 }
models.addresses.findAll().then(addresses => {
    addresses.forEach(address => {

        if (address.currency === 'btc') {
            btc_deposit(address.address);
        }

        if (address.currency === 'lsk') {
            lsk_deposit(address.address);
        }

        if (address.currency === 'bch') {
            bch_deposit(address.address);
        }

        if (address.currency === 'ltc') {
            ltc_deposit(address.address);
        }

        if (address.currency === 'eth') {
            eth_deposit(address.address)
        }

        if (address.currency === 'erc20') {
            erc20_deposit(address.address)
        }
    });
});


function btc_deposit(address) {
    insight.getUnspentUtxos(address, function (e, utxos) {
        if (e) {
            console.log(e)
        }
        else {
            utxos.forEach(utxo => {
                models.transactions.findOne({ where: { txid: utxo.txid, currency: 'btc' } }).then(transaction => {
                    if (transaction !== null) {
                        console.log('duplicated')
                    }
                    else {
                        if (confirmations >= minimum_confirmations[currency]) {
                            models.transactions.create({
                                currency: currency,
                                txid: utxo,
                                amount: amount,
                                confirmations: confirmations,
                                address: address,
                                category: 'receive',
                                confirmed: true
                            });
                        }
                        else {
                            models.transactions.create({
                                currency: currency,
                                txid: utxo,
                                amount: amount,
                                confirmations: confirmations,
                                address: address,
                                category: 'receive',
                                confirmed: false
                            });
                        }
                    }
                });
            });
        };
    });
};


function ltc_deposit(address) {

}

function lsk_deposit(address) {

}
function bch_deposit(address) {

}

function eth_deposit(address) {

}

function erc20_deposit(address) {

}