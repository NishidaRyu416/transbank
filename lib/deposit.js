const models = require('../models');
const request = require('request');

const minimum_confirmations = { 'btc': 5, 'lsk': 10, 'xrp': 5, 'eth': 20, 'erc20': 20 }

const deposit_btc = function deposit_btc(address) {

    request("https://testnet.blockexplorer.com/api/addr/" + address.address + '/utxo', function (e, utxos) {
        console.log(JSON.parse(utxos.body));
        if (e) {
            throw new Error(e)
        }
        else {
            JSON.parse(utxos.body).forEach(utxo => {
                models.transactions
                    .findOne({ where: { vout: utxo.vout, txid: utxo.txid, currency: 'btc' } })
                    .then(transaction => {

                        if (transaction) {

                            if (transaction.confirmed) {
                                console.log('duplicated');

                            }

                            else {

                                if (utxo.confirmations >= minimum_confirmations['btc']) {

                                    transaction.update({
                                        confirmations: utxo.confirmations,
                                        confirmed: true
                                    });

                                }

                                else {

                                    transaction.update({
                                        confirmations: utxo.confirmations
                                    });

                                }

                            }
                        }
                        else {

                            if (utxo.confirmations >= minimum_confirmations['btc']) {

                                models.transactions.create({
                                    currency: 'btc',
                                    txid: utxo.txid,
                                    vout: utxo.vout,
                                    walletId: address.walletId,
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
                                    vout: utxo.vout,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.address,
                                    walletId: address.walletId,
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

const deposit_ltc = function deposit_ltc(address) {

    request("https://testnet.blockexplorer.com/api/addr/" + address.address + '/utxo', function (e, utxos) {
        console.log(JSON.parse(utxos.body));
        if (e) {
            console.log(e)
        }
        else {
            JSON.parse(utxos.body).forEach(utxo => {
                models.transactions
                    .findOne({ where: { vout: utxo.vout, txid: utxo.txid, currency: 'btc' } })
                    .then(transaction => {

                        if (transaction) {

                            if (transaction.confirmed) {

                                console.log('duplicated');
                            }

                            else {

                                if (utxo.confirmations >= minimum_confirmations['btc']) {

                                    transaction.update({
                                        confirmations: utxo.confirmations,
                                        confirmed: true
                                    });

                                }

                                else {

                                    transaction.update({
                                        confirmations: utxo.confirmations
                                    });

                                }

                            }
                        }
                        else {

                            if (utxo.confirmations >= minimum_confirmations['btc']) {

                                models.transactions.create({
                                    currency: 'btc',
                                    txid: utxo.txid,
                                    vout: utxo.vout,
                                    walletId: address.walletId,
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
                                    vout: utxo.vout,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.address,
                                    walletId: address.walletId,
                                    category: 'receive',
                                    confirmed: false
                                });

                            }
                        }
                    });
            });
        };
    });
}

const deposit_lsk = function deposit_lsk(address) {

    request(`https://testnet-explorer.lisk.io/api/getTransactionsByAddress?address=${address.address}&offset=0`,

        function (error, res) {

            if (error) {
                throw new Error(error);
            }
            else {
                JSON.parse(res.body).transactions.forEach(utxo => {

                    models.transactions.findOne({ where: { currency: 'lsk', txid: utxo.id } }).then(transaction => {

                        if (transaction.confirmed) {
                            console.log('already executed')
                        }

                        else {
                            if (utxo.confirmations >= minimum_confirmations['lsk'] && utxo.recipientId === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: utxo.confirmations
                                }).catch(error)
                            }

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

const deposit_bch = function deposit_bch(address) {

    request("https://testnet.blockexplorer.com/api/addr/" + address.address + '/utxo', function (e, utxos) {
        console.log(JSON.parse(utxos.body));
        if (e) {
            console.log(e)
        }
        else {
            JSON.parse(utxos.body).forEach(utxo => {
                models.transactions
                    .findOne({ where: { vout: utxo.vout, txid: utxo.txid, currency: 'btc' } })
                    .then(transaction => {

                        if (transaction) {

                            if (transaction.confirmed) {

                                console.log('duplicated');
                            }

                            else {

                                if (utxo.confirmations >= minimum_confirmations['btc']) {

                                    transaction.update({
                                        confirmations: utxo.confirmations,
                                        confirmed: true
                                    });

                                }

                                else {

                                    transaction.update({
                                        confirmations: utxo.confirmations
                                    });

                                }

                            }
                        }
                        else {

                            if (utxo.confirmations >= minimum_confirmations['btc']) {

                                models.transactions.create({
                                    currency: 'btc',
                                    txid: utxo.txid,
                                    vout: utxo.vout,
                                    walletId: address.walletId,
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
                                    vout: utxo.vout,
                                    amount: utxo.amount,
                                    confirmations: utxo.confirmations,
                                    address: utxo.address,
                                    walletId: address.walletId,
                                    category: 'receive',
                                    confirmed: false
                                });

                            }
                        }
                    });
            });
        };
    });

}

const deposit_eth = function deposit_eth(address) {

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
                            if (utxo.confirmations >= minimum_confirmations['eth'] && utxo.address === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: utxo.confirmations
                                }).catch(error)
                            }
                        }

                        else {
                            //register unconfirmed transactions
                            if (utxo.confirmations < minimum_confirmations['eth'] && utxo.address === address.address) {
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

const deposit_erc20 = function deposit_erc20(address) {
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
                            if (utxo.confirmations >= minimum_confirmations['eth'] && utxo.address === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: utxo.confirmations
                                }).catch(error)
                            }
                        }

                        else {
                            //register unconfirmed transactions
                            if (utxo.confirmations < minimum_confirmations['eth'] && utxo.address === address.address) {
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

module.exports = {
    deposit_btc,
    deposit_bch,
    deposit_ltc,
    deposit_eth,
    deposit_erc20,
    deposit_lsk
}

