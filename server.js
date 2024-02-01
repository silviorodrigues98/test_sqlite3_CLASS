const express = require("express");
const app = express();
app.use(express.json()); // for parsing application/json
const dbFunctions = require("./database");
// ...

app.get('/api/:table', (req, res) => {
  try {
    dbFunctions.selectFromTable(req.params.table, (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/api/:table/:id', (req, res) => {
  try {
    dbFunctions.selectFromTableId(req.params.table, req.params.id, (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/api/:table", (req, res) => {
  try {
    dbFunctions.insertIntoTable(
      req.params.table,
      Object.keys(req.body),
      Object.values(req.body),
      (err) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.status(201).send("Row inserted successfully");
        }
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ...

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
