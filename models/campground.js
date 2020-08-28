const mongoose = require("mongoose");

// create the campground schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("campground", campgroundSchema);