'use strict';
require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
  const wallets = sequelize.define('wallets', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
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