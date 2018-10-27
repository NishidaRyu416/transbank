'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('transactions', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false
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
    }
  }, {});
  transactions.associate = function (models) {
    // associations can be defined here
  };
  return transactions;
};