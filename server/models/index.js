const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true,
    },
  },
);

const Project = require("./project")(sequelize, DataTypes);
const Application = require("./application")(sequelize, DataTypes);
const User = require("./user")(sequelize, DataTypes);
const Message = require("./message")(sequelize, DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  Project,
  Application,
  User,
  Message,
};
