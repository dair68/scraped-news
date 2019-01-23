const express = require("express");
var exphbs  = require('express-handlebars');
var logger = require("morgan");

const mongoose = require("mongoose");
const db = require("./models");

const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Configure middleware
// Make public a static folder
app.use(express.static("public"));

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//obtains all the articles currently in mongo db
// app.get("/", function (req, res) {
//     db.Article.find({}, function (err, docs) {
//         if (err) {
//             throw err;
//         }

//         res.json(docs);
//         //console.log(docs);
//     });
// });

//scrapes the huffington post and displays to front page
app.get("/", function (req, res) {
    axios.get('https://www.huffingtonpost.com')
        .then(function (response) {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                //console.log(html);

                let headlines = [];
                $(".card__headline").each(function (i, elem) {
                    const title = $(this).find($(".card__headline__text")).text().trim();
                    const link = $(this).find($(".card__link")).attr("href");

                    headlines.push({
                        title: title,
                        link: 'https://www.huffingtonpost.com'+link
                    });
                });

                //console.log(headlines);
                //db.Article.insertMany(headlines, err => { if (err) throw err; });
                //res.send("scrape complete");
                const context = {headlines: headlines};
                res.render("index", context);
            }
        }).catch(error => console.log(error));
});

app.listen(PORT, () => console.log("App listening on port " + PORT + "!"));


