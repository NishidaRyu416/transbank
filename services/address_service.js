var coins = require('../coins');
var security_service = require('./security_service')

module.exports.create_new_address = function (currency) {

    if (currency === 'btc') {
        var { address, private_key } = coins.btc.create_account();
        console.log(address, private_key)
        return { address: address, private_key: security_service.encrypt(private_key) }
    }

    if (currency === 'xrp') {
    }

    if (currency === 'lsk') {
        var { address, passphrase } = coins.lsk.create_account();
        return { address: address, private_key: security_service.encrypt(passphrase) }
    }
}

