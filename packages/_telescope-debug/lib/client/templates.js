var templatesDep = new Tracker.Dependency;

var createHighlighter = function (templateName, $node, data) {

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


    // add click event on the template highlighter that logs out template info to the console
    var template = Template[templateName];
    div.click(function () {
      console.log({
        name: templateName,
        helpers: _.keys(template.__helpers),
        events: template.__eventMaps[0] && _.keys(template.__eventMaps[0]),
        data: data,
        // html: Blaze.toHTMLWithData(template, data),
        template: template
      });
    });

    $node.append(div);  
};

Telescope.debug.refresh = function () {
  console.log('refreshing…')

  // trigger autorun to re-run
  templatesDep.changed();
};

Template.onRendered(function () {

  var template = this;
  var templateName = template.view.name.replace("Template.", "");
  var context = this.data;

  // exclude weird Blaze stuff and special templates
  var excludedTemplates = ["__dynamicWithDataContext", "__dynamic", "module", "menuComponent", "menuItem", "avatar", "posts_list_controller"];

  if (!_.contains(excludedTemplates, templateName)) {

    Meteor.autorun(function (comp) {

      templatesDep.depend() ;

      // do nothing the first time (instead, wait to be triggered by hotkey)
      if (!comp.firstRun) {

        // console.log(templateName)
        // console.log(template)
        // console.log("-------------")

        // TODO: when using {{#if}}, template.firstNode stays empty even after it's rendered
        var node = template.firstNode;

        if (node) {

          // console.log("highlighting template: "+ template);
          // console.log(this);

          try {

            // if this is a text node, try using nextSibling instead
            // TODO: kinda hacky
            if (node.nodeName === "#text") {
              if (node.nextSibling && node.nextSibling.nodeName !== "#text") {
                node = node.nextSibling;
              } else {
                throw new Error("Node has no content");
              }
            }

            // do the thing 
            createHighlighter(templateName, $(node), context);

          } catch (error) {
            // catch errors (usually text-only nodes, or empty templates)
            // console.log(templateName);
            // console.log(error);
          }
        }
      }

    });
  }
});

$(function () {

  var allowKeydown = true;

  $(document).keydown(function (e) {
    if (!allowKeydown) return;

    if(e.keyCode === 192){
      Telescope.debug.refresh();
      // $("body").addClass("show-highlighters");
    }

    allowKeydown = false;
  });

  $(document).keyup(function (e) {
    allowKeydown = true;
    if(e.keyCode === 192){
      // $("body").removeClass("show-highlighters");
      $(".template-highlighter").remove();
    }
  });

});