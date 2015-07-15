var createHighlighter = function (template, $node) {

    var h = $node.outerHeight();
    var w = $node.outerWidth();
    var l = $node.offset().left;
    var t = $node.offset().top;
    var depth = $node.parents().length;
    var position = $node.css('position');

    var offsetParent = $node.offsetParent();
    var offsetParentLeft = offsetParent.offset().left;
    var offsetParentTop = offsetParent.offset().top;

    // console.log(template, h, w, l, t);
    // console.log(offsetParent, offsetParentLeft, offsetParentTop)

    var div = $(document.createElement("section"));

    div.addClass("template-highlighter");
    div.css("height", h);
    div.css("width", w);
    
    if ($node.hasClass("zone-wrapper")) {
      div.addClass("zone-highlighter");
      template = $node.attr("data-zone");
    }

    // if node's position is already relative or absolute, position highlighter at 0,0
    if (position === "relative" || position === "absolute") {
      div.css("left", 0);
      div.css("top", 0);
    } else {
      div.css("left", l - offsetParentLeft);
      div.css("top", t - offsetParentTop);
    }

    div.css("z-index", 10000+depth);
    div.attr("data-template", template);

    $node.append(div);  
};

Template.onRendered(function () {


  var node = this.firstNode;
  var template = this.view.name.replace("Template.", "");

  // exclude weird Blaze stuff and special templates
  var excludedTemplates = ["__dynamicWithDataContext", "__dynamic", "module", "menuComponent", "menuItem", "avatar"];

  if (node && !_.contains(excludedTemplates, template)) {

    // console.log(this);

    try {

      // if this is a text node, try using nextElementSibling instead
      if (node.nodeName === "#text") {
        node = node.nextElementSibling;
      }

      // put this in setTimeout so app has the time to load in content
      Meteor.setTimeout(function () {
        var $node = $(node);
        var div = createHighlighter(template, $node);
        $node.append(div);
      }, 1000);

    } catch (error) {
      console.log(template);
      console.log(error);
    }
  }

});

$(function () {

  var allowKeydown = true;

  $(document).keydown(function (e) {
    if (!allowKeydown) return;

    if(e.keyCode === 192){
      $("body").addClass("show-highlighters");
    }
    allowKeydown = false;
  });

  $(document).keyup(function (e) {
    allowKeydown = true;
    if(e.keyCode === 192){
      $("body").removeClass("show-highlighters");
    }
  });

});