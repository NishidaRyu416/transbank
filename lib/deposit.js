const models = require('../models');
const request = require('request');

const minimum_confirmations = { 'btc': 5, 'lsk': 10, 'xrp': 5, 'eth': 20, 'erc20': 20 }

module.exports = function deposit_btc(address) {
    request(process.env.BTC_UTXO_URL + address.address + '/utxo', function (e, utxos) {

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

module.exports = function deposit_ltc(address) {
}

module.exports = function deposit_lsk(address) {

    request(`https://testnet-explorer.lisk.io/api/getTransactionsByAddress?address=${address.address}&offset=0`,

        function (error, res) {

            if (error) {
                throw new Error(error);
            }
            else {
                JSON.parse(res.body).transactions.forEach(utxo => {

                    models.transactions.findOne({ where: { currency: 'lsk', txid: utxo.id } }).then(transaction => {

                        if (transaction.confirmed == true) {
                            console.log('already executed')
                        }

                        if (transaction.confirmed == false) {
                            if (utxo.confirmations >= minimum_confirmations['lsk'] && utxo.recipientId === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: utxo.confirmations
                                }).catch(error)
                            }
                        }

                        else {
                            //register unconfirmed transactions
                            if (utxo.confirmations < minimum_confirmations['lsk'] && utxo.recipientId === address.address) {
                                models.transactions.create({
                                    currency: 'lsk',
                                    txid: utxo.id,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.recipientId,
                                    category: 'receive',
                                    confirmed: false
                                });
                            }

                            //register confirmed trnasactions
                            if (utxo.confirmations >= minimum_confirmations['lsk'] && utxo.recipientId === address.address) {
                                models.transactions.create({
                                    currency: 'lsk',
                                    txid: utxo.id,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.recipientId,
                                    category: 'receive',
                                    confirmed: true
                                });
                            }
                        }
                    });
                });
            }
        });
}

module.exports = function deposit_bch(address) {

}

module.exports = function deposit_eth(address) {
    request(`http://api.etherscan.io/api?module=account&action=txlistinternal&address=${address.address}&sort=asc&apikey=I2DH3Z2VMYD5EY9VVT4Z4V9K17PS6A3N1T`,

        function (error, res) {

            if (error) {
                throw new Error(error);
            }

            else {
                JSON.parse(res.body).transactions.forEach(utxo => {

                    models.transactions.findOne({ where: { currency: 'eth', txid: utxo.id } }).then(transaction => {

                        if (transaction.confirmed == true) {
                            console.log('already executed')
                        }

                        if (transaction.confirmed == false) {
                            if (utxo.confirmations >= minimum_confirmations['eth'] && utxo.recipientId === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: utxo.confirmations
                                }).catch(error)
                            }
                        }

                        else {
                            //register unconfirmed transactions
                            if (utxo.confirmations < minimum_confirmations['eth'] && utxo.recipientId === address.address) {
                                models.transactions.create({
                                    currency: 'eth',
                                    txid: utxo.id,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.recipientId,
                                    category: 'receive',
                                    confirmed: false
                                });
                            }

                            //register confirmed trnasactions
                            if (utxo.confirmations >= minimum_confirmations['eth'] && utxo.recipientId === address.address) {
                                models.transactions.create({
                                    currency: 'eth',
                                    txid: utxo.id,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.recipientId,
                                    category: 'receive',
                                    confirmed: true
                                }).then(tx => {
                                    address.update({ amount: tx.amount })
                                });
                            }
                        }
                    });
                });
            }
        });
}

module.exports = function deposit_erc20(address) {

}


