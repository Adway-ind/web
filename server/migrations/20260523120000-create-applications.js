'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      position: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: '',
      },
      portfolio: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '',
      },
      linkedin: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '',
      },
      cover_note: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      resume: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '',
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'new',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('applications');
  },
};
