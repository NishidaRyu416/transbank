'use strict';
module.exports = (sequelize, DataTypes) => {
  const addresses = sequelize.define('addresses', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
  }, {});
  addresses.associate = function (models) {
    models.addresses.hasMany(models.transactions);
  };
  return addresses;
};