const lisk = require('lisk-elements').default;
const { Mnemonic } = lisk.passphrase;


// transfer('0.11', '13730060744463677832L', 'chicken notable art clever situate media pen silk all industry flower share');


module.exports.create_account = function () {
    const passphrase = Mnemonic.generateMnemonic();
    var address = ''

    if (Mnemonic.validateMnemonic(passphrase, Mnemonic.wordlists.english)) {
        const { privateKey, publicKey } = lisk.cryptography.getKeys(passphrase);
        address = lisk.cryptography.getAddressFromPublicKey(publicKey);
    }

    return { address: address, passphrase: passphrase }
}

module.exports.get_balance = function (address) {

}

module.exports.get_tx = function (txid) {

}
// 3540555160147702300L
// chicken notable art clever situate media pen silk all industry flower share

// 13730060744463677832L
// obvious margin taxi silk scorpion apology essay throw mammal note moon found