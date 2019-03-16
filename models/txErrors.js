'use strict';
module.exports = (sequelize, DataTypes) => {
    const txErrors = sequelize.define('txErrors', {
        error: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    txErrors.associate = function (models) {
        models.txErrors.belongsTo(models.wallets);
        models.txErrors.belongsTo(models.transactions);
    };
    return txErrors;
};