var crypto = require("crypto");
require('dotenv').config();

module.exports.encrypt = function (key) {
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

module.exports.decrypt = function (key) {
    var password = process.env.PASSWORD
    // 復号
    var decipher = crypto.createDecipher('aes192', password);
    var dec = decipher.update(key, 'hex', 'utf8');
    dec += decipher.final('utf8');

    console.log('復号化(AES192) : ');
    console.log(dec);
    return dec;
};