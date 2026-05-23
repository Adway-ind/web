'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change the main cover image column type from VARCHAR to LONGTEXT
    await queryInterface.changeColumn('projects', 'image', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });

    // Change the gallery images column type from VARCHAR to LONGTEXT
    await queryInterface.changeColumn('projects', 'images', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // If you ever need to rollback, change them back to standard text lines
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