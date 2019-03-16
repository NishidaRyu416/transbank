'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('transactions', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vout: {
      type: DataTypes.INTEGER
    },
    txid: {
      type: DataTypes.STRING
    },
    fee: {
      type: DataTypes.STRING
    },
    confirmations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {});
  transactions.associate = function (models) {
    models.transactions.belongsTo(models.wallets);
    models.transactions.hasMany(models.txErrors);
  };
  return transactions;
};