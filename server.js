// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
// var Comment = require("./models/Comment.js");
// var Article = require("./models/Article.js");

// // Our scraping tools
// var request = require("request");
// var cheerio = require("cheerio");

var exphbs = require("express-handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

process.env.MONGODB_URI
if (process.env.MONGODB_URI) {
       mongoose.connect(process.env.MONGODB_URI);
} else {
    // Database configuration with mongoose
    mongoose.connect("mongodb://localhost/echojsdb")
}
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes
var  apiRoutes = require("./routes/api.js")
app.use("/api", apiRoutes);
var  viewRoutes = require("./routes/view.js")
app.use("/", viewRoutes);

var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});