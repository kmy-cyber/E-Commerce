// my-ecommerce-backend/config/db.js
const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // Cargar .env desde la carpeta del backend

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, // Nombre de la base de datos
  process.env.MYSQL_USER, // Usuario de la base de datos
  process.env.MYSQL_PASSWORD, // Contraseña del usuario
  {
    host: process.env.MYSQL_HOST || "localhost", // Host de la base de datos (por defecto localhost)
    port: process.env.MYSQL_PORT || 3306, // Puerto de MySQL (por defecto 3306)
    dialect: "mysql", // Especifica el dialecto de MySQL
    logging: false, // Desactiva el log de SQL en consola (pon true para depurar)
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos MySQL establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos MySQL:", error);
    process.exit(1); // Salir del proceso si hay un error de conexión
  }
};

module.exports = { sequelize, connectDB };
