
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

db.run(`CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, isbn TEXT, cover BLOB, pages INTEGER, genre TEXT)`);


app.get("/api/stats", (req, res) => {
    
    db.all('SELECT genre, COUNT(*) AS count FROM books GROUP BY genre ORDER BY count DESC', (err, genreRows) => {
        if (err) {
            throw err;
        }
    
        console.log("Genre Rows:", genreRows);
    
        const genresArray = genreRows.map(row => ({ genre: row.genre, count: row.count }));
        
        console.log("Genres Array:", genresArray);
        
        console.log("Genre Rows:", genreRows[0]);

        db.all('SELECT pages, COUNT(*) AS count FROM books GROUP BY pages', (err, pagesRows) => {
            if (err) {
                throw err;
            }

            let sum = 0;
            let totalCount = 0;

            for (let i = 0; i < pagesRows.length; i++) {
                sum += pagesRows[i].pages * pagesRows[i].count;
                totalCount += pagesRows[i].count;
            }

            const averagePages = sum / totalCount;
            console.log(averagePages)

            const result = {
                genres: genreRows,
                avg: averagePages
            };

            res.json(result);
        });
    });
});



app.post("/api/addbook", async (req, res) => {
    console.log(req.body);
    try {
        if (!req.body || !req.body.isbn) {
            return res.status(400).json({ message: "ISBN is required in the request body" });
        }

        // Fetch book data from Open Library API
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${req.body.isbn}`);
        const coverRequest = await axios.get(`https://covers.openlibrary.org/b/isbn/${req.body.isbn}-M.jpg`);
        const bookData = response.data.items[0].volumeInfo;
        const cover = coverRequest.data;

        console.log(bookData);

        db.run(
            `INSERT INTO books (title, author, isbn, cover, pages, genre) VALUES (?, ?, ?, ?, ?, ?)`,
            [bookData.title, bookData.authors[0], req.body.isbn, cover, bookData.pageCount, bookData.categories ? bookData.categories[0] : null],
            function (err) {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({ message: "Error adding book" });
                }

                console.log(`${bookData.title} added`);
                res.json({ message: `${bookData.title} added` });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding or fetching book data" });
    }
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
