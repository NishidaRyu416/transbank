const RippleAPI = require('ripple-lib').RippleAPI
// TESTNET ADDRESS 1
const api = new RippleAPI({
  //server: 'wss://s1.ripple.com'                 // MAINNET
  server: 'wss://s.altnet.rippletest.net:51233'   // TESTNET
});


module.exports.get_balance = function (address) {

}



module.exports.transfer = function (address,amount,tag) {
  api.connect().then(() => {
    console.log('Connected...')
  
    const ADDRESS_1 = "rsxGTpCTP4xRUtoLASqyGKqCAzVAFEdeT5"
    const SECRET_1 = "ssi39QoijXJJcZeSCt8toqcA8Hs4F"
    // TESTNET ADDRESS 2
    const ADDRESS_2 = address
    const currency = 'XRP'
    const amount = '0.1'
    const payment = {
      source: {
        address: ADDRESS_1,
        maxAmount: {
          value: amount,
          currency: currency
        }
      },
      destination: {
        address: ADDRESS_2,
        tag: 11,
        amount: {
          value: amount,
          currency: currency
        }
      }
    }

    api.preparePayment(ADDRESS_1, payment).then(prepared => {
     const { signedTransaction, id } = api.sign(prepared.txJSON, SECRET_1)
      console.log(id)
      api.submit(signedTransaction).then(result => {
        console.log(JSON.stringify(result, null, 2))
        api.disconnect()
      })
    });
  }).catch(console.error)
}
//rsxGTpCTP4xRUtoLASqyGKqCAzVAFEdeT5 ssi39QoijXJJcZeSCt8toqcA8Hs4F
//dest account address: rUpjgjeDKjyiX7aKu6zLqYHjyGNVMCibqk, secret: ssyXMWJc489dYoQgD3fE2JqZpzFFK
