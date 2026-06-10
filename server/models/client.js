module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Path to uploaded logo image (e.g. /uploads/logos/xxx.webp)",
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Display order — lower numbers appear first",
      },
    },
    {
      tableName: "clients",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
};
