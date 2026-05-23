module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Application",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
      },
      portfolio: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      linkedin: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      coverNote: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      resume: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "new",
      },
    },
    {
      tableName: "applications",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
};
