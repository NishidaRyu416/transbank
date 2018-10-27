'use strict';
const uuidv4 = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: uuidv4()
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      balance: {
        type: Sequelize.STRING,
        defaultValue: '0',
        allowNull: false
      },
      in_use: {
        type: Sequelize.STRING,
        defaultValue: '0',
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('wallets');
  }
};