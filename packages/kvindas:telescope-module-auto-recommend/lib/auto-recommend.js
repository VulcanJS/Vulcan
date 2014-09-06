Meteor.startup(function () {

  Template[getTemplate('post_submit')].events({
    'blur #url': function(e){
      var url=$("#url").val(),
          $titleLinkEl = $(".get-title-link"),
          $titleEl = $("#title"),
          $descEl  = $("#editor iframe").contents().find("#epiceditor-editor-frame").contents().find("body"),
          suggestion;

      $titleLinkEl.addClass("loading");
      recommendTitleAndContent(url, function(err, suggestedTitle, suggestedDescription){
        // Error occurred
        if(err){
          $titleLinkEl.removeClass("loading");
          return;
        }
        $titleLinkEl.removeClass("loading");
        if (suggestedTitle){
          $titleEl.val(suggestedTitle);
        }
        if (suggestedDescription){
          $descEl.text(suggestedDescription);
        }

      })

    }
  });

});


// utility functions
// Validates if url exists, in case it does, returns the url result
function recommendTitleAndContent(url, cb){
  var suggestedTitle, suggestedDescription, failFn;

  if(!url){
    return;
  }
  $.get(url).done(function(response){
    if(!response.results || response.results.length === 0 ){
      cb("Url not found");
      return;
    }
    suggestedTitle=getTitleFromHtml(response.results[0]);
    suggestedDescription=getDescriptionFromHtml(response.results[0]);
    cb(null, suggestedTitle, suggestedDescription);
  }).fail(function(){
    cb("Error occurred while extracting title and description");
  });
}

function getTitleFromHtml(htmlTxt){
  var title = ((/<title>(.*?)<\/title>/m).exec(htmlTxt));
  return title[1];
}

function getDescriptionFromHtml(htmlTxt){
  var description = ((/content="(.*?)"\s.*name="description"/mi).exec(htmlTxt));
  if(!description){
    description = ((/content="(.*?)"\s.*name="description"/mi).exec(htmlTxt));
  }
  if(!description){
    description = ((/content="(.*?)"\s.*property="og:description"/mi).exec(htmlTxt));
  }
  if(!description){
    description = ((/property="og:description"\s.*content="(.*?)"/mi).exec(htmlTxt));
  }
  if(!description){
    description = ((/<p>(.*?)<\/p>/m).exec(htmlTxt));
  }
  if(description){
    return description[1];
  }
  return undefined;
}
