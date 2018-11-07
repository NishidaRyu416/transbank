const lisk = require('lisk-elements').default;
const { Mnemonic } = lisk.passphrase;
const testnetClient = lisk.APIClient.createTestnetAPIClient();

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

module.exports.transfer = function (address, amount, passphrase, data) {

    transaction = lisk.transaction.transfer({
        amount: lisk.transaction.utils.convertLSKToBeddows(amount),
        recipientId: address,
        data: data,
        passphrase: passphrase
    });

    testnetClient.transactions.broadcast(transaction)
        .then(console.info)
        .catch(console.error);

    return transaction
}

module.exports.get_balance = function (address) {

}
// 3540555160147702300L
// chicken notable art clever situate media pen silk all industry flower share

// 13730060744463677832L
// obvious margin taxi silk scorpion apology essay throw mammal note moon found