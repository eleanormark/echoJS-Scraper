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
    $(".saved-article-panel").css('display','block');
    $(".new-article-panel").css('display','none');
    $('.custome-saved-panel').remove();

    $.get('/api/articles', {}, function (result) {
        console.log("Scraping Results");
        console.log(result);
        $(".new-article-panel").css('display','none');
        $('.custome-saved-panel').remove();
        result.forEach(function(element) {
            var queue = '<div class="custome-saved-panel panel-group">';
            queue += '<div class="panel panel-default">';
            queue += '<div class="panel-heading">';
            queue += '<h4 class="panel-title">';
            queue += '<a class="delete-saved-article" data-article-id="'+ element._id +'">&#x24e7</a>';
            queue += "&nbsp&nbsp&nbsp" ;
            queue += '<a class="custome-collapse" data-toggle="collapse" data-toggle-article-id='+element._id +' href="#collapse'+element._id +'">&#9661;</a>';
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
            queue += 'Save Comment</button></div>'
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
    var prependLoc = "#collapse" + articleId + " .panel-body";
    var savedComment = {};
    savedComment['_article'] = articleId;
    savedComment['comment'] = commentText;

    $.ajax({
      url: '/api/comment',
      type: 'POST',
      data: savedComment 
    }).then(function(response) {
        console.log(response)
        var queue = '<div class="row saved-comment">'
        queue += '<div class="col-xs-10">'+ response.comment + '</div>'
        queue += '<div class="col-xs-2">'
        queue += '<button class="btn delete-comment" data-comment-id="' + response._id +'">'
        queue += 'x</button></div>'
        queue += '</div>'
        $(prependLoc).prepend(queue);
    })
    $(textFieldId ).val('');


})

//show comments
$(document).on("click", ".custome-collapse",function() {
    var id = $(this).data("toggle-article-id");
    var prependLoc = "#collapse" + id + " .panel-body";

    $.ajax({
      url: '/api/articles/' + id,
      method: 'GET'
    }).then(function(response) {
        $('.row.saved-comment').remove();
        response.comments.forEach(function(element){
            var queue = '<div class="row saved-comment">'
            queue += '<div class="col-xs-10">'+ element.comment+ '</div>'
            queue += '<div class="col-xs-2">'
            queue += '<button class="btn delete-comment" data-comment-id="' + element._id +'">'
            queue += 'x</button></div>'
            queue += '</div>'
            $(prependLoc).prepend(queue);
        });
    })

})

//delete saved article pannel 
$(document).on("click", ".delete-comment",function() {
    var commentId = $(this).data("comment-id");
    var comment = { commentId: commentId };
    console.log(comment);

    $.ajax({
      url: '/api/comment',
      type: 'DELETE',
      data: comment
    }).then(function(response) {
      console.log(response);
    })
    $(this).parent().parent().remove();
})