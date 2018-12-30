var models = require('../models');
var depsoit = require('../lib/deposit')



models.addresses.findAll().then(addresses => {
    addresses.forEach(address => {

        const currency = address.currency;

        if (currency === 'btc') {
            depsoit.deposit_btc(address);
        }

        else if (currency === 'lsk') {
            depsoit.deposit_lsk(address);
        }

        else if (currency === 'bch') {
            depsoit.deposit_bch(address);
        }

        else if (currency === 'ltc') {
            depsoit.deposit_ltc(address);
        }

        else if (currency === 'eth') {
            depsoit.deposit_eth(address)
        }
        else if (currency === 'erc20') {
            depsoit.deposit_erc20(address)
        }
    });
});





