module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true,
      },
      excerpt: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
        comment: "Short summary shown on listing pages",
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
        comment: "Path to cover image (/uploads/blogs/xxx.webp)",
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Adway Team",
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      tags: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
        comment: "Comma-separated tags",
      },
      readingTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: "Estimated reading time in minutes",
      },
      published: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "1 = published, 0 = draft",
      },
    },
    {
      tableName: "blogs",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { unique: true, fields: ["slug"] },
        { fields: ["published"] },
        { fields: ["category"] },
      ],
    },
  );
};
