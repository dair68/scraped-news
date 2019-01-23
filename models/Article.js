const mongoose = require("mongoose");

//the Schema constructor
const Schema = mongoose.Schema;

//schema for storing articles
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

//creating the articles model
const Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;