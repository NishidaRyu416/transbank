const models = require('../models');
const axios = require('axios');
const bn = require('bignumber.js')
const coin_service = require('../services/coin_service')
const minimum_confirmations = { 'btc': 5, 'lsk': 10, 'xrp': 5, 'eth': 20, 'erc20': 20 }

const deposit_btc = function deposit_btc(address) {
    axios
        .get("https://testnet.blockexplorer.com/api/addr/" + address.address + '/utxo').
        then(res => {
            res.data.forEach(utxo => {
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
                    })
                    .catch(() => {
                        if (utxo.confirmations >= minimum_confirmations['btc']) {

                            models.transactions.create({
                                currency: 'btc',
                                txid: utxo.txid,
                                vout: utxo.vout,
                                walletId: address.walletId,
                                amount: utxo.amount,
                                confirmations: utxo.confirmations,
                                address: utxo.address,
                                category: 'deposit',
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
                                category: 'deposit',
                                confirmed: false
                            });

                        }
                    });
            });
        })
        .catach(error => {
            throw new Error(error)
        })
};

const deposit_lsk = function deposit_lsk(address) {
    axios.get(`https://testnet-explorer.lisk.io/api/getTransactionsByAddress?address=${address.address}&offset=0`)
        .then(res => {
            res.data.transactions.forEach(utxo => {
                models.transactions.findOne({ where: { currency: 'lsk', txid: utxo.id } })
                    .then(transaction => {

                        if (transaction.confirmed) {
                            console.log('already executed')
                        }
                    })

                    .catch(() => {
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
                                category: 'deposit',
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
                                category: 'deposit',
                                confirmed: true
                            });
                        }
                    });
            });
        })
        .catch(error => {
            throw new Error(error)
        })
}
const deposit_eth = function deposit_eth(address) {

    axios.get(`https://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=${address.address}&sort=asc&apikey=I2DH3Z2VMYD5EY9VVT4Z4V9K17PS6A3N1T`)
        .then(res => {
            res.data.result.forEach(tx => {
                console.log(res)
                models.transactions.findOne({ where: { currency: 'eth', txid: tx.hash, confirmed: false } })
                    .then(transaction => {

                        if (transaction.confirmed == false) {
                            if (new bn(tx.confirmations).isGreaterThanOrEqualTo(new bn(minimum_confirmations['eth'])) && tx.to === address.address) {
                                transaction.update({
                                    confirmed: true,
                                    confirmations: parseInt(tx.confirmations, 10)
                                }).catch(error)
                            }
                        }
                    })
                    .catch(() => {

                        //register unconfirmed transactions
                        if (new bn(tx.confirmations).isLessThan(new bn(minimum_confirmations['eth'])) && tx.to === address.address) {
                            models.transactions.create({
                                currency: 'eth',
                                txid: tx.hash,
                                amount: tx.value,
                                confirmations: parseInt(tx.confirmations, 10),
                                address: tx.to,
                                category: 'deposit',
                                confirmed: false
                            });
                        }

                        //register confirmed trnasactions
                        if (new bn(tx.confirmations).isGreaterThanOrEqualTo(new bn(minimum_confirmations['eth'])) && tx.to === address.address) {
                            models.transactions.create({
                                currency: 'eth',
                                txid: tx.hash,
                                amount: tx.value,
                                confirmations: parseInt(tx.confirmations, 10),
                                address: tx.to,
                                category: 'deposit',
                                confirmed: true
                            }).then(tx => {
                                address.update({ amount: tx.value })
                            });
                        }
                    });
            });
        })
        .catch(error => {
            throw new Error(error);
        })
}
const deposit_erc20 = (address) => {
    axios
        .get(`https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address.address}&sort=asc&apikey=I2DH3Z2VMYD5EY9VVT4Z4V9K17PS6A3N1T`)
        .then(res => {
            res.data.result.forEach(async tx => {
                console.log(tx.contractAddress)
                const coin = await coin_service.getTokenBycontractAddress(tx.contractAddress)
                if (coin) {
                    console.log(coin.name)
                    models.transactions.findOne({ where: { currency: coin.name, txid: tx.hash, confirmed: false } })
                        .then(transaction => {
                            if (transaction.confirmed == false) {
                                if (new bn(tx.confirmations).isGreaterThanOrEqualTo(new bn(coin.minimum_confirmations)) && tx.to === address.address) {
                                    transaction.update({
                                        confirmed: true,
                                        confirmations: parseInt(tx.confirmations, 10)
                                    }).catch(error)
                                }
                            }
                        })
                        .catch(() => {
                            //register unconfirmed transactions
                            if (new bn(tx.confirmations).isLessThan(new bn(coin.minimum_confirmations)) && tx.to === address.address) {
                                models.transactions.create({
                                    currency: coin.name,
                                    txid: tx.hash,
                                    amount: tx.value,
                                    confirmations: parseInt(tx.confirmations, 10),
                                    address: tx.to,
                                    category: 'deposit',
                                    processed: true,
                                    confirmed: false
                                });
                            }

                            //register confirmed trnasactions
                            if (new bn(tx.confirmations).isGreaterThanOrEqualTo(new bn(coin.minimum_confirmations)) && tx.to === address.address) {
                                models.transactions.create({
                                    currency: coin.name,
                                    txid: tx.id,
                                    amount: tx.value,
                                    confirmations: parseInt(tx.confirmations, 10),
                                    address: tx.to,
                                    category: 'deposit',
                                    processed: true,
                                    confirmed: true
                                }).then(tx => {
                                    address.update({ amount: tx.value })
                                });
                            }
                        });
                }
            });
        })
        .catch(error => {
            throw new Error(error)
        })
}

/* Coins we will be supporting soon.
 
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
 
*/


module.exports = {
    deposit_btc,
    //deposit_bch,
    //deposit_ltc,
    deposit_eth,
    deposit_erc20,
    deposit_lsk
}

