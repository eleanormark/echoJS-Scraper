var express = require('express');
var controller = require('../controllers/app_controller.js');

var router = new express.Router();


router.get("/scrape", controller.scrapeArticles)        // A GET request to scrape the echojs website
    .get('/articles', controller.getAllArticles)        // This will get the articles we scraped from the mongoDB
    .get("/articles/:id", controller.getArticle)        // Grab an article by it's ObjectId
    // .delete("/articles/:id", controller.deleteArticle)
    .post('/articles/:id"', controller.postNewComment)      // Create a new note or replace an existing note
    // .delete('/articles/:id"', controller.deleteComment)

module.exports = router;