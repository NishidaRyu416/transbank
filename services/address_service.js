require('dotenv').config();
var coins = require('../coins');
var crypto = require("crypto");

function encrypt(key) {
    var password = process.env.PASSWORD

    console.log('暗号化するテキスト : ' + key);
    console.log('暗号化キー        : ' + password);
    // 暗号化
    var cipher = crypto.createCipher('aes192', password);
    var cipheredText = cipher.update(key, 'utf8', 'hex');
    cipheredText += cipher.final('hex');

    console.log('暗号化(AES192) :');
    console.log(cipheredText);

    return cipheredText;
};

function decrypt(key) {
    var password = process.env.PASSWORD
    // 復号
    var decipher = crypto.createDecipher('aes192', password);
    var dec = decipher.update(key, 'hex', 'utf8');
    dec += decipher.final('utf8');

    console.log('復号化(AES192) : ');
    console.log(dec);
    return dec;
};

module.exports.create_new_address = function (currency) {
    if (currency === 'btc') {
        var { address, private_key } = coins.btc.create_account();
        return { address: address, private_key: encrypt(private_key) }
    }

    if (currency === 'xrp') {
    }

    if (currency === 'lsk') {
        var { address, passphrase } = coins.lsk.create_account();
        return { address: address, private_key: encrypt(passphrase) }
    }
}