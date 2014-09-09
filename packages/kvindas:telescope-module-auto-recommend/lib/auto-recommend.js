Meteor.startup(function () {

  if(!Meteor.isClient){
    return;
  }
  var template = Template[getTemplate('post_submit')];
  if(!template){ return; }

  template.events({
    'blur #url': function(e){
      AutoRecommendService.autoRecommendTitleAndContent();
    }
  });

});

AutoRecommendService = {};

AutoRecommendService.isAutoRecommendEnabled = function(){
  var setting = getSetting("autoRecommendTitleAndContent");
  return !!setting;
}

AutoRecommendService.autoRecommendTitleAndContent = function() {
  if(!this.isAutoRecommendEnabled() ){
    return;
  }

  var url=$("#url").val(),
    $titleLinkEl = $(".get-title-link"),
    $titleEl = $("#title"),
    $descEl  = $("#editor iframe").contents().find("#epiceditor-editor-frame").contents().find("body");

  $titleLinkEl.addClass("loading");
  this.recommendTitleAndContent(url, function(err, suggestedTitle, suggestedDescription){
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

// Validates if url exists, in case it does, returns the url result
AutoRecommendService.recommendTitleAndContent = function (url, cb){
  var suggestedTitle, suggestedDescription, failFn;

  if(!url){
    return;
  }
  var _this = this;
  $.get(url).done(function(response){
    if(!response.results || response.results.length === 0 ){
      cb("Url not found");
      return;
    }
    suggestedTitle = _this.getTitleFromHtml(response.results[0]);
    suggestedDescription = _this.getDescriptionFromHtml(response.results[0]);
    cb(null, suggestedTitle, suggestedDescription);
  }).fail(function(){
    cb("Error occurred while extracting title and description");
  });
}

AutoRecommendService.getTitleFromHtml = function(htmlTxt){
  var title = ((/<title>(.*?)<\/title>/m).exec(htmlTxt));
  if(!title){
    return "";
  }
  return title[1];
}

AutoRecommendService.getDescriptionFromHtml = function(htmlTxt){
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
  return "";
}
