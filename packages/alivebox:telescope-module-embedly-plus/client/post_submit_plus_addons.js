Template[getTemplate('post_submit_plus')].helpers({
  post_submit_addons: function () {
    return getTemplate('post_submit_plus_addons');
  },

  isEmbedlyEnabled: function() {
    return ExtractUrlDataService.isEmbedlyEnabled();
  }

});

Template[getTemplate('post_submit_plus')].events({

  'blur #url': function(e){
    ExtractUrlDataService.extractUrlDataAndPopulateForm();
  },

  'click .get-content-link': function(e){
    e.preventDefault();
    ExtractUrlDataService.extractUrlDataAndPopulateForm();
  }

});

ExtractUrlDataService = {};

ExtractUrlDataService.extractUrlDataAndPopulateForm = function(){
  var els = ExtractUrlDataService.getFormElements(),
      url = ExtractUrlDataService.getCleanUrl(els.$urlEl.val());

  if(!url){ return; }

  els.$contentLinkEl.addClass("loading");
  ExtractUrlDataService.extractUrlData(url, function(err, result){
    els.$contentLinkEl.removeClass("loading");
    // Error occurred
    if(err || !result){ return; }
    ExtractUrlDataService.updateFormFromData(els, result);
  });

}

ExtractUrlDataService.extractUrlData = function(url, cb){
  Meteor.call("extractUrlData", url, function(err, result){
    cb(err, result);
  });
}

ExtractUrlDataService.getFormElements = function(){
  var els = {
    $urlEl : $("#url"),
    $contentLinkEl : $(".get-content-link"),
    $titleEl : $("#title"),
    $descEl  : $("#editor iframe").contents().find("#epiceditor-editor-frame").contents().find("body"),
    $keywordsEl : $("#keywords"),
    $mediaEl : $("#media"),
    $providerNameEl : $("#providerName"),
    $providerUrlEl : $("#providerUrl"),
    $thumbnailImgEl : $("#thumbnailImg")
  };
  return els;
}

ExtractUrlDataService.updateFormFromData = function(els, data){
  els.$titleEl.val(data.title ? data.title : "");
  els.$descEl.text(data.description ? data.description : "");
  els.$keywordsEl.val(JSON.stringify(data.keywords));
  els.$mediaEl.val(JSON.stringify(data.media));
  els.$providerNameEl.val(data.providerName ? data.providerName : "");
  els.$providerUrlEl.val(data.providerUrl ? data.providerUrl : "");
  if(data.thumbnailUrl){
    els.$thumbnailImgEl.attr('src', data.thumbnailUrl);
  }
}

ExtractUrlDataService.getCleanUrl = function(url){
  if(!url){
    return;
  }
  var cleanUrl = (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") ? url : "http://"+url;
  return cleanUrl;
}

ExtractUrlDataService.addonPropertiesCallback = function(props){
  if(!props || !ExtractUrlDataService.isEmbedlyEnabled() ){ return props; }
  props.keywords= JSON.parse($('#keywords').val());
  props.media= JSON.parse($('#media').val());
  props.providerName= $('#providerName').val();
  props.providerUrl= $('#providerUrl').val();
  props.thumbnailUrl= $('#thumbnailImg').attr('src');
  return props;
}

ExtractUrlDataService.isEmbedlyEnabled = function(){
  return !!getSetting('embedlyKey');
}

// Add it to client callbacks
postSubmitClientCallbacks.push(ExtractUrlDataService.addonPropertiesCallback);
