'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('txErrors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      error: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dealt: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      walletId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'id'
        }
      },
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id'
        }
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
    return queryInterface.dropTable('txErrors');
  }
};
