var bitcore = require('bitcore-lib');
var bg = require('bignumber.js');
require('dotenv').config();


module.exports.create_account = function () {

    if (process.env.ENV === 'development') {
        var private_key = new bitcore.PrivateKey(bitcore.Networks.testnet);
    }
    else {
        var private_key = new bitcore.PrivateKey(bitcore.Networks.livenet);
    }


    var address = private_key.toAddress();

    return { address: address.toString(), private_key: private_key.toString() }
};
