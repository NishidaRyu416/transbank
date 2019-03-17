'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'coins',
      'decimals',
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
