'use strict';
module.exports = (sequelize, DataTypes) => {
  const coins = sequelize.define('coins', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contractAddress: {
      type: DataTypes.STRING
    },
    minimalConfirmations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fee: {
      type: DataTypes.STRING,
      allowNull: false
    },
    decimals: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  coins.associate = function (models) {
  };
  return coins;
}

