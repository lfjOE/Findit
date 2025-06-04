const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "DB_FindIt",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectando a MYSQL...");
});

module.exports = db;
