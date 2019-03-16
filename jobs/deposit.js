const models = require('../models');
const depsoit = require('../lib/deposit')

models.addresses.findAll().then(addresses => {
    addresses.forEach(address => {

        const currency = address.currency;
        switch (currency) {
            case 'btc':
                break;
            case 'lsk':
                depsoit.deposit_lsk(address);
                break;
            case 'eth':
                depsoit.deposit_eth(address)
                depsoit.deposit_erc20(address)
                break;
            // case 'bch':
            //     depsoit.deposit_bch(address);
            //     break;
            // case 'ltc':
            //     depsoit.deposit_ltc(address);
            //     break;
            // case 'xrp':
            //     break;
        }
    });
});





