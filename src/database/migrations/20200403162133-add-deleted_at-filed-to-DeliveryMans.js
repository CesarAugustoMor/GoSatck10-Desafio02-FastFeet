'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_mans', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('delivery_mans', 'deleted_at');
  },
};
