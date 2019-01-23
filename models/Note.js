const mongoose = require("mongoose");

//the Schema constructor
const Schema = mongoose.Schema;

//schema for notes database
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

//creating notes model
const Notes = mongoose.model("Notes", NoteSchema);

module.exports = Notes;