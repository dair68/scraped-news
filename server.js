const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/", function(req, res) {
    res.send("Hello World");
    axios.get('https://www.huffingtonpost.com')
        .then(response => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                //console.log(html);

                let headlines = [];
                $(".card__headline").each(function(i,elem) {
                    const title = $(this).find($(".card__headline__text")).text().trim();
                    const link = $(this).find($(".card__link")).attr("href");

                    headlines.push({
                        title: title,
                        link: link
                    });
                });

                console.log(headlines);
            }
        }).catch(error => console.log(error));
});

app.listen(PORT, () => console.log("App listening on port " + PORT + "!"));

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

// const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

// const ArticleSchema = new Schema({
//     title     : String,
//     link      : String,
//     note      : Schema.Types.ObjectId,
//     saved     : Boolean
// });

// const NoteSchema = new Schema({
//     title     : String,
//     body      : String
// })
