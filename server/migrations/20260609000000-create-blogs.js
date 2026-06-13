'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true,
      },
      excerpt: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: '',
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      cover_image: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: '',
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Adway Team',
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: '',
      },
      tags: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: '',
      },
      reading_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      published: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('blogs', ['slug'], { unique: true });
    await queryInterface.addIndex('blogs', ['published']);
    await queryInterface.addIndex('blogs', ['category']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blogs');
  },
};
