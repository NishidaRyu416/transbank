const models = require('../../models');

const bn = require('bignumber.js');
const request = require('request');

const starter = () => {

    models.transactions.findAll({
        where: {
            category: 'send',
            fee: null,
            confirmed: false
        }
    })
        .then(transactions => {
            transactions.forEach(transaction => {
                switch (transaction.currency) {
                    case 'btc':
                        btc(transaction)
                        break;
                    // case 'ltc':
                    //     ltc(transaction)
                    //     break;
                    // case 'eth':
                    //     eth(transaction)
                    //     break;
                }
            });
        })
}

const btc = (transaction) => {
    request(`https://testnet.blockexplorer.com/api/addr/txid/${transaction.txid}`,
        function (err, res) {
            if (err) {

            }
            else {
                if (JSON.parse(res.body).confirmations > 5) {

                    transaction.update({
                        confirmations: JSON.parse(res.body).confirmations,
                        confirmed: true
                    }).catch(error => {
                        throw new Error(error);
                    }).then(transaction => {
                        if (transaction.confirmations === JSON.parse(res.body).confirmations && transaction.confirmed === true) {
                            console.log('sucessfully updated')
                        }
                        else {
                            console.log('roll back.')
                        }
                    })

                } else {

                    transaction.update({
                        confirmations: JSON.parse(res.body).confirmations,
                        confirmed: false
                    })

                }
            }
        }
    );
}

const ltc = (transaction) => {
    request(`${transaction.txid}`)
}

const eth = (transaction) => {
    request(`${transaction.txid}`)
}
const erc20 = (transaction) => {
    request(`${transaction.txid}`, res => {
        JSON(res.body)
    })
}

export default starter();