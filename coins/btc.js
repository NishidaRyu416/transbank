var bitcore = require('bitcore-lib');

module.exports.create_account = function () {
    var private_key = new bitcore.PrivateKey(bitcore.Networks.testnet);

    var address = private_key.toAddress();

    return { address: address, private_key: private_key }
}

module.exports.transfer = function (address, amount, private_key) {

    var privateKey = new bitcore.PrivateKey(private_key);
    var utxo = {
        "txId": "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
        "outputIndex": 0,
        "address": "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
        "script": "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
        "satoshis": 50000
    };

    var transaction = new bitcore.Transaction()
        .from(utxo)
        .to(address, amount)
        .change(process.env.BTC_CHANGE_ADDRESS)
        .sign(private_key);


}