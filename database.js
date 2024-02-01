const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const dir = "db";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
let db = new sqlite3.Database(
  "./db/sample.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

const validTables = ["users", "orders", "products"]; // Add your valid table names here

function createTable(tableName, params) {
  const columns = params
    .map((param) => `${param.name} ${param.type}`)
    .join(", ");
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns})`;

  db.run(sql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table created successfully.");
    }
  });
}

function insertIntoTable(tableName, columns, values) {
  const placeholders = values.map(() => "?").join(", ");
  const sql = `INSERT INTO ${tableName}(${columns.join(
    ", "
  )}) VALUES(${placeholders})`;

  db.run(sql, values, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row inserted with rowid ${this.lastID}`);
  });
}

function selectFromTable(table, callback) {
  if (!validTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  db.all(`SELECT * FROM ${table}`, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function selectFromTableId(table, id, callback) {
  if (!validTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  db.all(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function closeConnection() {
  // close the database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

function dropTable(tableName) {
  const sql = `DROP TABLE IF EXISTS ${tableName}`;

  db.run(sql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Table dropped successfully.");
    }
  });
}

module.exports = {
  createTable,
  insertIntoTable,
  selectFromTable,
  selectFromTableId,
};
