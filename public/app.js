// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
        .done(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
    // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

//start scrape
$("#scrape").on("click", function() {
    $(".saved-article-panel").css('display','none');
    // $(".new-article-panel").empty();
    $.get('/api/scrape', {}, function (result) {
        console.log("Scraping Results");
        console.log(result);
        alert("Scraping completed.  Found " + result.length  + " new article(s)." );
        $(".new-article-panel").css('display','block');

        result.forEach(function(element) {

            var $a = $('<a/>', {
                "target" : "_blank",
                "href" : element.link,
                "text" : element.title
            });

            var $button = $('<button/>', {
                    text: '+',
                    class: 'btn'
                });
    
             $("#articles").prepend("<div>" + $button.get(0).outerHTML + "&nbsp&nbsp&nbsp" + $a.get(0).outerHTML + "</div>");
            
        }, this);
    })
})

//Save article button
$(document).on("click", ".new-article-panel .btn", function() {

    $.ajax({
        method: "POST",
        url: "/api/newArticle",
        data: {
            // Value taken from title input
            title: $(this).next("a").text(),
            // Value taken from note textarea
            link: $(this).next("a").attr("href")
        }
    })
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
        });
    $(this).parent().remove();

})

//show saved article pannel 
$(document).on("click", "#saved-articles",function() {
    $(".new-article-panel").css('display','none');
    $(".saved-article-panel").css('display','block');
     $(".saved-article-panel .panel-group").empty();
    $.get('/api/articles', {}, function (result) {
        console.log("Scraping Results");
        console.log(result);
        $(".new-article-panel").css('display','none');
        result.forEach(function(element, index) {
            var queue = '<div class="panel-group">';
            queue += '<div class="panel panel-default">';
            queue += '<div class="panel-heading">';
            queue += '<h4 class="panel-title">';
            queue += '<a class="delete-saved-article" data-article-id="'+ element._id +'">&#x24e7</a>';
            queue += "&nbsp&nbsp&nbsp" ;
            queue += '<a data-toggle="collapse" href="#collapse'+element._id +'">&#9661;</a>';
            queue += "&nbsp&nbsp&nbsp" ;
            queue += '<a href="' + element.link + '">"' + element.title + '"</a>';
            queue += '</h4>';
            queue += '</div>';
            queue += '<div id="collapse'+ element._id +'" class="panel-collapse collapse">'
            queue += '<div class="panel-body">'
            queue += '<div class="form-group">'
            queue += '<label for="comment">New Comment:</label>'
            queue += '<textarea class="form-control" rows="5" id="comment-area'+ element._id +'"></textarea>'
            queue += '</div>'
            queue += '</div>'
            queue += '<div class="panel-footer">'
            queue += '<button type="button" class="btn btn-warning save-comment" data-article-id="'+ element._id +'">'
            queeu += 'Save Comment</button></div>'
            queue += '</div>'
            queue += '</div>'
            queue += '</div>'
            $("#saved-articles-panel-body").prepend(queue);
        }, this);
    }) 

})

//delete saved article pannel 
$(document).on("click", ".delete-saved-article",function() {
    var articleId = $(this).data("article-id");

    var article = { articleId: articleId };

    console.log(article);
    $.ajax({
      url: '/api/article',
      type: 'DELETE',
      data: article
    }).then(function(response) {
      console.log(response)
    })
    $(this).parent().parent().parent().parent().remove();
})

//save new comment
$(document).on("click", ".save-comment",function() {
    var articleId = $(this).data("article-id");
    var textFieldId = "#comment-area" + articleId;
    var commentText = $(textFieldId ).val();
    var savedComment = {};
    savedComment['_article'] = articleId;
    savedComment['comments'] = commentText

    $.ajax({
      url: '/api/comment',
      type: 'POST',
      data: savedComment 
    }).then(function(response) {
      console.log(response)
    })
    $(textFieldId ).val('');
})
