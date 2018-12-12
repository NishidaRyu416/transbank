var models = require('../models');
var request = require('request');

var minimum_confirmations = { 'btc': 5, 'lsk': 10, 'xrp': 5 }

module.exports = function deposit_btc(address) {
    request(process.env.BTC_UTXO_URL + req.query.address + '/utxo', function (e, utxos) {
        if (e) {
            console.log(e)
        }
        else {
            JSON.parse(utxos).forEach(utxo => {
                models.transactions.findOne({ where: { txid: utxo.txid, vout: utxo.vout, currency: 'btc' } }).then(transaction => {
                    if (transaction != null) {
                        console.log('duplicated')
                    }
                    else {
                        if (utxo.confirmations >= minimum_confirmations['btc']) {
                            models.transactions.create({
                                currency: 'btc',
                                txid: utxo.txid,
                                vout: utxo.vout,
                                amount: utxo.amount,
                                confirmations: utxo.confirmations,
                                address: utxo.address,
                                category: 'receive',
                                confirmed: true
                            });
                        }
                        else {
                            models.transactions.create({
                                currency: 'btc',
                                txid: utxo.txid,
                                amount: utxo.amount,
                                confirmations: utxo.confirmations,
                                address: utxo.address,
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

models.exports = function deposit_ltc(address) {
}

models.exports = function deposit_lsk(address) {
    request(`https://testnet-explorer.lisk.io/getTransactionsByAddress?address=${address}&limit=50&offset=0`)
}
models.exports = function deposit_bch(address) {

}

models.exports = function deposit_eth(address) {

}

models.exports = function deposit_erc20(address) {

}
