const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: Schema.Types.ObjectId,
    saved: {
        type: Boolean,
        default: false
    }
});

const NoteSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    body: {
        type: String,
        default: ""
    }
});

const ArticlesDB = mongoose.model("Articles", ArticleSchema);

//obtains all the articles currently in mongo db
app.get("/", function (req, res) {
    ArticlesDB.find({}, function (err, docs) {
        if (err) {
            throw err;
        }

        res.json(docs);
        //console.log(docs);
    });
});

//scrapes the huffington post and adds articles to mongo db
app.post("/scrape", function (req, res) {
    res.send("Hello World");
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
                        link: link
                    });
                });

                //console.log(headlines);

                ArticlesDB.insertMany(headlines, err => { if (err) throw err; });
                res.send("scrape complete");
            }
        }).catch(error => console.log(error));
});

app.listen(PORT, () => console.log("App listening on port " + PORT + "!"));


