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
const validTables = ["users", "orders", "products"]; // Add your valid table names here

function selectFromTable(table) {
  if (!validTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
  // query the rows in the langs table
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}

function selectFromTableId(table, id) {
  if (!validTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  db.all(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
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

// ...

createTable("users", [
  { name: "id", type: "INTEGER PRIMARY KEY AUTOINCREMENT" },
  { name: "name", type: "text" },
  { name: "email", type: "text" },
]);
insertIntoTable(
  "users",
  ["name", "email"],
  ["Silvio Correa", "silviorodrigues98@hotmail.com"]
);

selectFromTableId("users", "5");
