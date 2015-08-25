Template.logo.helpers({
  logoUrl: function(){
    return Settings.get('logoUrl');
  }
});

Template.logo.onRendered(function () {
  // var $logo = $(Template.instance().firstNode);
  // var offsetX = $logo.outerWidth() * -0.5;
  // var offsetY = $logo.outerHeight() * -0.5;
  // $logo.css("margin-left", offsetX);
  // $logo.css("margin-top", offsetY);
});