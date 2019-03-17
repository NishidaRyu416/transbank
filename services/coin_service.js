const coins = require('../models').coins
const bluebird = require("bluebird");

const getAllSupportedCoinsNames = () => {
    return new bluebird((resolve, reject) => {
        coins.findAll()
            .then(coins => {
                names = []
                coins.forEach(coin => {
                    names.push(coin.name)
                });
                resolve(names)
            })
            .catch(error => reject(error))
    });
}
const isSupportedByContractAddress = (contractAddress) => {
    return new bluebird((resolve, reject) => {
        coins.findOne({ where: { contractAddress: contractAddress } })
            .then(() => resolve(true))
            .catch(() => resolve(false))
    })
}
const isSupportedByName = (name) => {
    return new bluebird((resolve, reject) => {
        coins.findOne({ where: { name: name } })
            .then(() => resolve(true))
            .catch(() => resolve(false))
    })
}
const getTokenByName = (name) => {
    return new bluebird((resolve, reject) => {
        coins.findOne({ where: { name: name } })
            .then((coin) => {
                console.log(coin)
                resolve(coin)
            })
            .catch((error) => reject(error))
    })
}
const getTokenBycontractAddress = (contractAddress) => {
    return new bluebird((resolve, reject) => {
        coins.findOne({ where: { contractAddress: contractAddress } })
            .then((coin) => {
                console.log(coin)
                resolve(coin)
            })
            .catch((error) => reject(error))
    })
}
const getTokenDecimalsByName = (name) => {
    return new bluebird((resolve, reject) => {
        coins.findOne({ where: { name: name } })
            .then((coin) => resolve(coin.decimals))
            .catch((error) => reject(error))
    })
}

module.exports = {
    getAllSupportedCoinsNames,
    isSupportedByContractAddress,
    isSupportedByName,
    getTokenBycontractAddress,
    getTokenByName,
    getTokenDecimalsByName
}