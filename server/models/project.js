module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tags: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const raw = this.getDataValue("tags");
          if (!raw) return [];
          return raw
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        },
        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue("tags", value.join(", "));
          } else {
            this.setDataValue("tags", value);
          }
        },
      },
      year: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      challenge: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const raw = this.getDataValue("images");
          if (!raw) return [];
          try {
            return JSON.parse(raw);
          } catch {
            return [];
          }
        },
        set(value) {
          this.setDataValue("images", Array.isArray(value) ? JSON.stringify(value) : value);
        },
      },
      featured: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "projects",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
};
