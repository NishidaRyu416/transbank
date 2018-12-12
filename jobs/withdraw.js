// This job is for withdrawing.
// This can only be proccessed once per hour for a security reason.

var models = require('../models');
var BigNumber = require('bignumber.js');
var security_service = require('../services/security_service')

const lsk = require('lisk-elements').default;
const testnetClient = lsk.APIClient.createTestnetAPIClient();

var depsoit = require('../lib/deposit')

function withdraw() {
    models.transactions.findAll({ where: { confirmed: false, txid: null, category: 'send' } }).then(transactions => {
        transactions.forEach(transaction => {

            if (transaction.currency === 'btc') {
                withdraw_btc(transaction)
            }
            if (transaction.currency === 'lsk') {
                withdraw_lsk(transaction)
            }
            if (transaction.currency === 'xrp') { }

            if (transaction.currency === 'eth') {
                withdraw_eth(transaction)
            }

        })
        console.log('done')
    });
}

function withdraw_lsk(transaction) {

    // trnasfer(amount, address, passphrase)
    // In lisk, passpharses are considered to be private keys

    const to_address = transaction.address;
    const amount = transaction.amount;

    models.wallets.findOne({ where: { id: transaction.walletId } })
        .then(wallet => {

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
        })
}

function withdraw_btc(transaction) {

    const to_address = transaction.address;
    const amount = transaction.amount;
    const wallet = transaction.wallet;

    if (wallet.currency !== 'btc') {
        throw new Error('This wallet is not for btc, but for ' + wallet.currency)
    }

    wallet.addresses.findAll().then(addresses => {
        addresses.some(address => {
            request(process.env.BTC_UTXO_URL + address.address + '/utxo', function (error, utxos) {
                if (error) {
                    throw new Error(error)
                }
                else {
                    JSON.parse(utxos.body).some(utxo => {
                        if (utxo.amount > amount) {
                            private_key = new bitcore.PrivateKey(security_service.decrypt(address.private_key), bitcore.Networks.testnet);
                            var transaction = new bitcore.Transaction()
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
};

function withdraw_eth(transaction) {
    const to_address = transaction.address;
    const amount = transaction.amount;
    const wallet = transaction.wallet;

    if (wallet.currency !== 'eth') {
        throw new Error('This wallet is not for eth, but for ' + wallet.currency)
    }


}
var request = require('request');
const address = "11809622817268705387L"
request(`https://testnet-explorer.lisk.io/api/getTransactionsByAddress?address=${address}&limit=50&offset=0`, function (error, res) {
    console.log(res)
})