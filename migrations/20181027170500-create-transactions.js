'use strict';
const uuidv4 = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        allowNull: false
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      txid: {
        type: Sequelize.STRING
      },
      fee: {
        type: Sequelize.STRING
      },
      confirmations: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};