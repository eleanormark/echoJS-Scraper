// Requiring our Note and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var Promise = require('bluebird');

// Use in a  GET request to scrape the echojs website
var scrapeArticles = function(req, res) {

    var scrapedArticles = [];
    // First, we grab the body of the html with request
    request("http://www.echojs.com/", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            if (result.title && result.link){
                scrapedArticles.push(entry);
            }
            // Now, save that entry to the db            
            // entry.save(function(err, doc) {
            //     // Log any errors
            //     if (err) {
            //         console.log(err);
            //     }
            //     // Or log the doc
            //     else {
            //         console.log(doc);
            //     }
            // });
        });
           res.json(scrapedArticles);
    });
    // Tell the browser that we finished scraping the text
    // res.send("Scrape Completed.  Number of Article(s): ");
} 

var postNewArticle = function(req, res) {

    // Save an empty result object
    var result = {};
    // Add the text and href of every link, and save them as properties of the result object
    result.title = req.body.title;
    result.link = req.body.link;


    var entry = new Article(result);    
        entry.save(function(err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
        }
        // Or log the doc
        else {
            console.log(doc);
        }
    });

}

// Use in getting all the articles we scraped from the mongoDB
var getAllArticles = function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
}

// delete an article
var deleteArticle = function(req, res) {
    var id = req.body.articleId;
    console.log("id is>>>>", id);

    Article.deleteOne({ "_id": id}, function(err, result) {
    console.log("Deleted article " + id);
    console.log(JSON.parse(result));
    res.json(result);
  })
}

// Grab an article by it's ObjectId
var  getArticle = function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
        .populate("comment")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
}

// Use for creating a new note or replace an existing note
var postNewComment = function(req, res) {
    // Create a new comment and pass the req.body to the entry
    var newComment = new Comment(req.body);

    var articleId = req.body['_article'];
    console.log("article =================");
    console.log(articleId);
    // And save the new comment the db
    newComment.save(function(error, doc) {
        // Log any errors
        if (error) {
            console.lgo("post error");
            console.log(error);
        }
        // Otherwise
        else {
            // Use the article id to find and update it's comment
            Article.update({ "_id": articleId  }, {$push: { "comments": newComment._id }}, function(err, result){
                if(err) {
                console.log(err);
                console.log("err at comment arr==================");
                }else {
                    res.json(newComment);
                    console.log("not showing error");
                    console.log(newComment);
                }})
        }
    });
}

// var getComments = function(req, res) {  
//        console.log("====================get comments")
//     var id = req.params.id;
 
//     Article.findOne({_id: id}).populate('comments').exec(function (err, doc) {
//         if (err) {
//             console.log(err)
//         } else {
//         res.json(doc)
//         }
//     })
// }

// get a specific article, with related comments 
var  getComments = function (req, res) {
  var id = req.params.id;
  Promise.resolve(Article.findOne({_id: id}).populate('comments').exec())
  .then(function(doc) {
    console.log("==================================found article is >>>>", doc);
    res.json(doc);
  })
  .catch(function (err) {
    console.log(`===============================error geting that specific article, ${err}`);
    res.end(404);
  })
}

var deleteComment = function (req, res) {
    Comment.deleteOne({ "_id": req.body.commentId}, function (err, result) {
        console.log("Deleted comment " + req.body.commentId);
        console.log(JSON.parse(result));
        res.json(result);
    })
}

module.exports = {
    scrapeArticles: scrapeArticles,
    getAllArticles:  getAllArticles,
    getArticle: getArticle,
    deleteArticle: deleteArticle,
    postNewArticle: postNewArticle,
    postNewComment: postNewComment,
    getComments: getComments,
    deleteComment: deleteComment
}
