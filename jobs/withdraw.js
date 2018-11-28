// This command is for withdrawing.
// This can only be proccessed once per hour for a security reason.

var models = require('../models');
var BigNumber = require('bignumber.js');
var lsk = require('/lib/lisk.js')
var xrp = require('/lib/xrp.js')
var security_service = require('../services/security_service')

function withdraw() {
    models.transactions.findAll({ where: { confirmed: false, txid: null, category: 'send' } }).then(transactions => {
        transactions.forEach(transaction => {
            if (transaction.currency === 'btc') {
                withdraw_btc(transaction.address, transaction.amount, transaction.wallet)
            }
            if (transaction.currency === 'lsk') {
                // trnasfer(amount, address, passphrase)
                // In lisk, passpharses are considered to be private keys
            }
            if (transaction.currency === 'xrp') { }

        });
    });
}

function withdraw_btc(to_address, amount, wallet) {

    var from_address = '';

    wallet.addresses.some(address => {
        request(process.env.BTC_UTXO_URL + address.address + '/balance',
            function (error, response) {
                if (error) {

                } else {
                    if (response > amount) {
                        from_address = address;
                        return true;
                    }
                }
            });
    });

    var private_key = new bitcore.PrivateKey(security_service.decrypt(from_address.private_key), bitcore.Networks.testnet);

    var source_address = private_key.toAddress();

    insight.getUnspentUtxos(source_address, function (e, utxos) {
        if (e) {
            console.log(e);
        } else {
            console.log(utxos);
            var transaction = new bitcore.Transaction()
                .from(utxos)
                .to(to_address, bitcore.Unit.fromBTC(bg(amount)).toSatoshis)
                .change(chnage_address)
                .sign(private_key);

            insight.broadcast(transaction, function (e, txid) {
                if (e) {

                } else {

                    res.send({ txid: txid });
                }
            });
        };
    });
};


