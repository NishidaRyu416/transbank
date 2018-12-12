var models = require('../models');
var depsoit = require('../lib/deposit')



models.addresses.findAll().then(addresses => {
    addresses.forEach(address => {

        if (address.currency === 'btc') {
            depsoit.deposit_btc(address.address);
        }

        if (address.currency === 'lsk') {
            depsoit.deposit_lsk(address.address);
        }

        if (address.currency === 'bch') {
            depsoit.deposit_bch(address.address);
        }

        if (address.currency === 'ltc') {
            depsoit.deposit_ltc(address.address);
        }

        if (address.currency === 'eth') {
            depsoit.deposit_eth(address.address)
        }

        if (address.currency === 'erc20') {
            depsoit.deposit_erc20(address.address)
        }
    });
});





