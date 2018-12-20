var crypto = require("crypto");
require('dotenv').config();

module.exports.encrypt = function (key) {
    const password = process.env.PASSWORD

    //console.log('The text to encrypt :' + key);
    //console.log('The key for an encryption :' + password);
    // Encrypt
    var cipher = crypto.createCipher('aes192', password);
    var cipheredText = cipher.update(key, 'utf8', 'hex');
    cipheredText += cipher.final('hex');

    //console.log('Encrypt(AES192) :');
    //console.log(cipheredText);

    return cipheredText;
};

module.exports.decrypt = function (key) {
    const password = process.env.PASSWORD
    // Decrypt
    var decipher = crypto.createDecipher('aes192', '416Nishidaryu');
    var dec = decipher.update(key, 'hex', 'utf8');
    dec += decipher.final('utf8');

    //console.log('Decrypt(AES192) : ');
    //console.log(dec);
    return dec;
};