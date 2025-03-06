require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cybersecurity",
  port: "3306",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.post("/signup", (request, response) => {
  const { username, password } = request.body;
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  db.query(query, (err) => {
    if (err)
      return response
        .status(500)
        .json({ error: "Error creating user", message: err });
    response.json({ message: "User registered" });
  });
});

app.post("/login", (request, response) => {
  console.log("111111111111111111", request.body);
  const { username, password } = request.body;
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  db.query(query, (err, results) => {
    if (err) return response.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      response.json({ message: "Login successful", user: results[0] });
    } else {
      response.status(401).json({ error: "Invalid credentials" });
    }
  });
});

app.get("/users", (request, response) => {
  const query = "SELECT * FROM users"; 
  db.query(query, (err, results) => {
    if (err) return response.status(500).json({ error: "Database error" });
    response.json(results);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
