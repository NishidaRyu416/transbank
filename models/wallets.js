'use strict';
module.exports = (sequelize, DataTypes) => {
  const wallets = sequelize.define('wallets', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.STRING,
      defaultValue: '0',
      allowNull: false
    },
    in_use: {
      type: DataTypes.STRING,
      defaultValue: '0',
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },

  }, {});
  wallets.associate = function (models) {
    models.wallets.hasMany(models.transactions);
    models.wallets.hasMany(models.addresses);
  };
  return wallets;
};