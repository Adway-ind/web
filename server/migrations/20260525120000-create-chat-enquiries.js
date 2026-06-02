'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_enquiries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      service: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      project_type: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      budget: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      timeline: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      contact_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      contact_business: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '',
      },
      contact_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      contact_phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      contact_requirements: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('chat_enquiries');
  },
};
