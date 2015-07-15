var templatesDep = new Tracker.Dependency;

var createHighlighter = function (templateName, $node) {

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
      templateName = $node.attr("data-zone");
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
    div.attr("data-template", templateName);

    $node.append(div);  
};

Router.configure({
  onBeforeAction: function () {
    // clear out all previous template highlighters
    this.next();
  },
  onRun: function () {
    // console.log("route changed");
    $(".template-highlighter").remove();

    // trigger autorun to re-run
    templatesDep.changed();
  }
});

Telescope.debug.refresh = function () {
  templatesDep.changed();
};

Template.onRendered(function () {

  var template = this;
  var templateName = template.view.name.replace("Template.", "");

  // exclude weird Blaze stuff and special templates
  var excludedTemplates = ["__dynamicWithDataContext", "__dynamic", "module", "menuComponent", "menuItem", "avatar"];

  if (!_.contains(excludedTemplates, templateName)) {

    Meteor.autorun(function () {

      templatesDep.depend() ;

      // console.log(templateName)
      // console.log(template)
      // console.log("-------------")

      // put this in setTimeout so app has the time to load in and render content
      Meteor.setTimeout(function () {

        var node = template.firstNode;

        if (node) {

          // console.log("highlighting template: "+ template);
          // console.log(this);

          try {

            // if this is a text node, try using nextElementSibling instead
            if (node.nodeName === "#text") {
              if (node.nextElementSibling) {
                node = node.nextElementSibling;
              } else {
                throw new Error("Node has no content");
              }
            }

            // do the thing 
            var div = createHighlighter(templateName, $(node));
            $(node).append(div);

          } catch (error) {
            console.log(templateName);
            console.log(node);
            console.log(error);
          }
        }
      }, 1000);

    });
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