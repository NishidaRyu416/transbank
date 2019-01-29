// This job is for withdrawing.
// This can only be proccessed once per hour for a security reason.

const models = require('../../models');

const bn = require('bignumber.js');

const deposit = require('.lib/deposit');
const request = require('request');

const security_service = require('../../services/security_service')

//start importing coins related stuff
//lsk
const lsk = require('lisk-elements').default;
const testnetClient = lsk.APIClient.createTestnetAPIClient();
//eth & erc 20
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/f45f0727305443c5bf64c6e30a0b2efb'));
const util = require('ethereumjs-util')
const abi = require('./coins/abi')
//end



const erc20 = ['rep', '']

function withdraw() {
    models.transactions.findAll({ where: { confirmed: false, txid: null, category: 'send' } }).then(transactions => {
        transactions.forEach(transaction => {

            const currency = transaction.currency

            if (currency === 'btc') {
                withdraw_btc(transaction);
            }
            else if (currency === 'lsk') {
                withdraw_lsk(transaction);
            }
            else if (currency === 'xrp') {

            }
            else if (currency === 'eth') {
                withdraw_eth(transaction);
            } else if (currency === 'ltc') {
                withdraw_ltc(transaction);
            } else if (currency === 'bch') {
                withdraw_bch(transaction);
            }

        });
        console.log('done')
    });
}

function withdraw_lsk(transaction) {

    // trnasfer(amount, address, passphrase)
    // In lisk, passpharses are considered to be private keys

    const to_address = transaction.address;
    const amount = transaction.amount;

    models.wallets.findOne({ where: { id: transaction.walletId } }).then(wallet => {

        if (wallet.currency !== 'lsk') {
            throw new Error('This wallet is not for lsk, but for ' + wallet.currency)
        }

        if (wallet.amount < transaction.amount) {
            throw new Error('This wallet is insufficinet for this transaction')
        }

        models.addresses.findAll({ where: { walletId: wallet.id } }).then(addresses => {
            addresses.some(address => {
                if (address.amount > amount) {

                    lsk_transaction = lsk.transaction.transfer({
                        amount: lsk.transaction.utils.convertLSKToBeddows(amount),
                        recipientId: to_address,
                        passphrase: security_service.decrypt(address.private_key)
                    });

                    testnetClient.transactions.broadcast(lsk_transaction)
                        .then(
                            transaction.update({
                                txid: lsk_transaction.id,
                                fee: '0.1'
                            })
                        )
                        .catch(error => { throw new Error(error) })

                    return true;
                }
            });
        });
    });
};
function withdraw_btc(transaction) {

    const to_address = transaction.address;
    const amount = transaction.amount;

    if (wallet.currency !== 'btc') {
        throw new Error('This wallet is not for btc, but for ' + wallet.currency)
    }
    models.wallets.findOne({ where: { id: transaction.walletId } }).then(wallet => {
        models.addresses.findAll({ where: { walletId: wallet.id } }).then(addresses => {
            addresses.some(address => {
                request(process.env.BTC_UTXO_URL + address.address + '/utxo', function (error, utxos) {
                    if (error) {
                        throw new Error(error)
                    }
                    else {
                        JSON.parse(utxos.body).some(utxo => {
                            if (utxo.amount > amount) {
                                private_key = new bitcore.PrivateKey(security_service.decrypt(address.private_key), bitcore.Networks.testnet);
                                const transaction = new bitcore.Transaction()
                                    .from(utxo)
                                    .to(to_address, bitcore.Unit.fromBTC(bg(amount)).toSatoshis)
                                    .change(chnage_address)
                                    .sign(private_key);
                                insight.broadcast(transaction, function (e, txid) {
                                    if (e) {

                                    } else {
                                        res.send({ txid: txid });
                                        transaction.update({ txid: txid })

                                    }
                                });
                                return true;
                            }

                        })
                    }
                });
            })

        });
    });
}

function withdraw_ltc(transaction) {

    const to_address = transaction.address;
    const amount = transaction.amount;

    if (wallet.currency !== 'ltc') {
        throw new Error('This wallet is not for btc, but for ' + wallet.currency)
    }

    models.wallets.findOne({ where: { id: transaction.walletId } }).then(wallet => {
        models.addresses.findAll({ where: { walletId: wallet.id } }).then(addresses => {
            addresses.some(address => {
                request(process.env.BTC_UTXO_URL + address.address + '/utxo', function (error, utxos) {
                    if (error) {
                        throw new Error(error)
                    }
                    else {
                        JSON.parse(utxos.body).some(utxo => {
                            if (utxo.amount > amount) {
                                private_key = new bitcore.PrivateKey(security_service.decrypt(address.private_key), bitcore.Networks.testnet);
                                const transaction = new bitcore.Transaction()
                                    .from(utxo)
                                    .to(to_address, bitcore.Unit.fromBTC(bg(amount)).toSatoshis)
                                    .change(chnage_address)
                                    .sign(private_key);
                                insight.broadcast(transaction, function (e, txid) {
                                    if (e) {

                                    } else {
                                        res.send({ txid: txid });
                                        transaction.update({ txid: txid })

                                    }
                                });
                                return true;
                            };
                        });
                    };
                });
            });
        });
    });
};

async function withdraw_eth(transaction) {

    const to_address = transaction.address;
    let amount = transaction.amount;

    if (wallet.currency !== 'eth') {
        throw new Error('This wallet is not for eth, but for ' + wallet.currency)
    }

    models.addresses.findAll({ where: { walletId: wallet.id } }).then(addresses => {
        addresses.some(address => {
            deposit.deposit_erc20(address)
            //execute a command in order to update a balance of an address

            if (address.amount > amount) {
                const private_key = util.toBuffer(security_service.decrypt(address.private_key), 'hex');

                const price = await gas_price()

                const nonce = await get_nonce(address.addresss);

                const limit = await gas_limit({
                    from: address.address,
                    to: to_address,
                    nonce: nonce
                });

                const rawTx = {
                    nonce: nonce,
                    gasPrice: price,
                    gasLimit: limit,
                    to: to_address,
                    value: web3.utils.numberToHex(web3.utils.toWei(amount, 'ether')),
                }

                const tx = new Tx(rawTx);

                tx.sign(private_key);

                const serializedTx = tx.serialize();

                web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(res => {
                    wallet.update({ txid: res.transactionHash });
                })
                return true;
            }
        });
    });
}

async function withdraw_erc20(transaction) {

    const to_address = transaction.address;
    let amount = transaction.amount;

    models.wallets.findOne({ where: { id: transaction.walletId } }).then(wallet => {


        if (erc20.includes(wallet.currency)) {
            throw new Error(`This wallet is not for supported erc20 tokens, but for` + wallet.currency)
        }

        if (wallet.amount < transaction.amount) {
            throw new Error('This wallet is insufficinet for this transaction.')
        }


        models.addresses.findAll({ where: { walletId: wallet.id } }).then(addresses => {
            addresses.some(address => {
                deposit.deposit_erc20(address)
                //execute a command in order to update a balance of an address

                if (address.amount > amount) {

                    const private_key = util.toBuffer(security_service.decrypt(address.private_key), 'hex');

                    const price = await gas_price()

                    const limit = await gas_limit()

                    const nonce = await nonce(address.address);

                    const abi = require('./coins/abi')

                    const contract_address

                    const contract = new web3.eth.Contract(abi, contract_address);

                    const decimals = bn(18);

                    amount = bn(amount).times(bn(10).pow(decimals));

                    const rawTx = {
                        nonce: nonce,
                        gasPrice: price,
                        gasLimit: limit,
                        to: contract_address,
                        value: '0x0',
                        data: contract.methods.transfer(to_address, web3.utils.toHex(amount)).encodeABI(),
                        nonce: nonce
                    };

                    const tx = new Tx(rawTx);

                    tx.sign(private_key);

                    const serializedTx = tx.serialize();

                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(res => {
                        wallet.update({ txid: res.transactionHash });
                    });

                    return true;
                };
            });
        });
    });
};



const get_abi = (contract_address) => {
    return new Promise((resolve, rejcet) => {
        request(`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=I2DH3Z2VMYD5EY9VVT4Z4V9K17PS6A3N1T`, function (error, data) {
            if (error) {
                rejcet(error)
            } else {
                abi = JSON.parse(data.body)
                resolve(abi.result);
            }
        });
    });
}

const gas_fee = () => {
    return new Promise((reslove, reject) => {
        request('', function (error, response) {
            if (error) {
                reject(error)
            }
            else {
                reslove(response);
            };
        });
    });
};
const gas_price = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getGasPrice().then(price => {
            resolve(web3.utils.toHex(price));
        }).catch(error => {
            reject(error)
        });
    });
}

const gas_limit = (transaction) => {
    return new Promise((resolve, reject) => {
        web3.eth.estimateGas(transaction).then(limit => {
            resolve(web3.utils.toHex(limit));
        }).catch(error => {
            reject(error)
        });
    });
}


const get_nonce = (address) => {
    return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(address).then(count => {
            resolve(web3.utils.toHex(count));
        }).catch(error => {
            reject(error)
        });
    });
}
