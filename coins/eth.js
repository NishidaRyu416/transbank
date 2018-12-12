const Wallet = require('ethereumjs-wallet');

exports.create_account = function () {
    // get the instance of a wallet
    const wallet = Wallet.generate();
    // get a private key
    const private_key = wallet.getPrivateKeyString();
    // get an address
    const address = wallet.getChecksumAddressString();
    // return values for address_service
    return { address: address, private_key: private_key }
}

