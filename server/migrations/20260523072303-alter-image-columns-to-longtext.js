'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify 'image' column from VARCHAR to LONGTEXT directly in MySQL
    await queryInterface.changeColumn('projects', 'image', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });

    // Modify 'images' column from VARCHAR to LONGTEXT directly in MySQL
    await queryInterface.changeColumn('projects', 'images', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert logic if things go wrong
    await queryInterface.changeColumn('projects', 'image', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('projects', 'images', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};