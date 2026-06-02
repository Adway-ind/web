module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ChatEnquiry",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      service: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      project_type: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      budget: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      timeline: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contact_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      contact_business: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      contact_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contact_phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      contact_requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "chat_enquiries",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
};
