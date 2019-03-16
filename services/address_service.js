var coins = require('../coins');
var security_service = require('./security_service')

module.exports.create_new_address = function (currency) {
    if (currency === 'btc') {
        let { address, private_key } = coins.btc.create_account();
        return { address: address, private_key: security_service.encrypt(private_key) };
    }
    else if (currency === 'xrp') {
    }
    else if (currency === 'lsk') {
        let { address, passphrase } = coins.lsk.create_account();
        return { address: address, private_key: security_service.encrypt(passphrase) }
    }
    else if (currency === 'eth') {
        let { address, private_key } = coins.eth.create_account();
        return { address: address, private_key: security_service.encrypt(private_key) }
    }
}
