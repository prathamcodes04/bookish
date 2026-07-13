import express from "express";
import axios from "axios";
import methodOverride from "method-override";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true})); //parse form data
app.use(methodOverride("_method")); // lets html forms send put/delete

//read (with sorting)
app.get("/", async(req, res) => {
    const sort = req.query.sort || "recent";

    //creating a whitelist, map users choice to a safe sql order by clause, only accept keys that exists in sortMap
    const sortMap = {
        recent: "date_read DESC",
        rating: "rating DESC",
        title: "title ASC",
    };
    const orderBy = sortMap[sort] || sortMap.recent;

    try{
        const result = await pool.query(`SELECT * FROM books ORDER BY ${orderBy}`);
        res.render("index.ejs", {
            books: result.rows,
            currentSort: sort
        });
    }catch(err){
        console.error("Erro fetching books:", err);
        res.status(500).send("Something went wrong loading your books");
    }
})

//create (form)
app.get("/new", (req, res) => {
    res.render("new.ejs");
});

//create (Api lookup + insert)
app.post("/books", async(req, res) => {
    //reading form data - using object destructuring
    const {title, author, rating, review, date_read} = req.body;

    try{
        //calling open library search api via axios to auto fetch cover + isbn
        const searchResponse = await axios.get("https://openlibrary.org/search.json", {
            //limit: 1, to return first best match
            params: {title, author, limit: 1},
        });
        //getting first book
        const doc = searchResponse.data.docs[0];
        //assume api doesent find anything
        let coverUrl = null;
        let isbn = null;
        //if book exists, continue extracting
        if(doc){
            //getting isbn using ternary operator 
            isbn = doc.isbn ? doc.isbn[0] : null;
            //getting cover image using cover id (cover_i)
            if(doc.cover_i){
                coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
            }
        }
        //insert into postgreSQL
        await pool.query(`
            INSERT INTO books 
            (title, 
            author, 
            isbn, 
            cover_url, 
            rating, 
            review, 
            date_read) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7)`, 
            [title, author, isbn, coverUrl, rating, review, date_read]);
        res.redirect("/");
    }catch(err){
        console.error("Erro adding book:", err);
        res.status(500).send("Couldn't fetch book deatils right now, Please try again.");
    }
});

//update (form)
app.get("/books/:id/edit", async(req, res) => {
    try{
        const result = await pool.query(
            `SELECT * FROM books WHERE id = $1`, 
            [req.params.id]
        );
        //if book not found
        if(result.rows.length === 0){
            return res.status(404).send("Book not found");
        }
        res.render("edit.ejs", {book: result.rows[0]});
    }catch(err){
        console.error("Erro fetching book:", err);
        res.status(500).send("Something went wrong.");
    }
});

//update (submit)
app.put("/books/:id", async(req, res) => {
    const {title, author, rating, review, date_read} = req.body;
    try{
        await pool.query(
            `UPDATE books SET title = $1, author = $2, rating = $3, review = $4,
            date_read = $5 WHERE id = $6`,
            [title, author, rating, review, date_read, req.params.id]
        );
        res.redirect("/");
    }catch(err){
        console.error("Erro updating book:", err);
        res.status(500).send("Couldn't update this book");
    }
});

//delete
app.delete("/books/:id", async(req, res) => {
    try{
        await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
        res.redirect("/");
    }catch(err){
        console.error("Erro deleting book:", err);
        res.status(500).send("Couldn't delete this book.");
    }
})

app.listen(PORT, () => {
    console.log(`Booknotes running on port ${PORT}`);
});