
const express = require("express");
const axios = require("axios");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/books.db');
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        res.json(rows);
    });
});

app.get("/api", (req, res) => {
    res.json({ message: "I'm aliveeee" });
});

db.run(`CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, isbn TEXT, cover BLOB)`);

app.post("/api/addbook", async (req, res) => {
    console.log(req.body);
    try {
        if (!req.body || !req.body.isbn) {
            return res.status(400).json({ message: "ISBN is required in the request body" });
        }

        // Fetch book data from Open Library API
        const response = await axios.get(`https://openlibrary.org/isbn/${req.body.isbn}.json`);
        const coverrequest = await axios.get(`https://covers.openlibrary.org/b/isbn/${req.body.isbn}-M.jpg`);
        var bookData = response.data;
        const author = await axios.get(`https://openlibrary.org/${bookData.authors[0].key}.json`);
        bookData.author = author.data.name;
        const cover = coverrequest.data;
        console.log(bookData);
        db.run(`INSERT INTO books (title, author, isbn, cover) VALUES (?, ?, ?, ?)`, [bookData.title, bookData.author, req.body.isbn,cover], function(err) {
            if (err) {
                console.log(err.message);
                return res.status(500).json({ message: "Error adding book" });
            }

            console.log(`${bookData.title} added`);
            res.json({ message: `${bookData.title} added`});
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching book data" });
    }
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
