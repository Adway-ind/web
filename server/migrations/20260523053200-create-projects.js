'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      desc: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tags: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      year: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      client: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      challenge: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      result: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      images: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('projects');
  },
};
