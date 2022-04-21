/** create server */
const express = require("express");
const app = express();
app.listen(3001, () => {
    console.log("Listening on port 3001.")
});

/** middleware */
const cors = require("cors");
app.use(cors());
app.use(express.json());

/** create database */
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("myDatabase.db");

function createDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS EmployeeSystem (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        country TEXT NOT NULL,
        position TEXT NOT NULL,
        salary INTEGER NOT NULL)
    `)
};

db.serialize(createDatabase);

app.post("/create", (req, res) => {
    /** getting informations from front-end */
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const position = req.body.position;
    const salary = req.body.salary;

    /** these variables insert into database */
    function insertDatas() {
        db.run(`
            INSERT INTO EmployeeSystem (name, age, country, position, salary)
            VALUES (?, ?, ?, ?, ?)`,
            [name, age, country, position, salary],
            (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    res.send("Values inserted")
                }
            }
        )
    };

    db.serialize(insertDatas)
});


app.get("/employees", (req, res) => {
    /** receiving everything from database */
    db.all("SELECT * FROM EmployeeSystem",
    (error, result) => {
        if (error) {
            console.log(error)
        } else {
            res.send(result)
        }
    })
});

