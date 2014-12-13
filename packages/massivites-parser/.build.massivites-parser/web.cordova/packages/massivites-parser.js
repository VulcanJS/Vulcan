(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/massivites-parser/lib/client/templates/template.parser-page.js                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
Template.__checkName("parserPage");                                                                             // 2
Template["parserPage"] = new Template("Template.parserPage", (function() {                                      // 3
  var view = this;                                                                                              // 4
  return HTML.FORM({                                                                                            // 5
    id: "parser-form"                                                                                           // 6
  }, "\n    ", HTML.TEXTAREA({                                                                                  // 7
    rows: "20",                                                                                                 // 8
    name: "body",                                                                                               // 9
    "class": "form-control",                                                                                    // 10
    style: "width:100%;",                                                                                       // 11
    id: "parser-json-feed"                                                                                      // 12
  }), HTML.Raw('\n    <hr>\n    <button class="submit btn header-submodule btn-primary">Submit</button>\n  ')); // 13
}));                                                                                                            // 14
                                                                                                                // 15
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/massivites-parser/lib/client/templates/parser-page.coffee.js                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.parserPage.events({
  'submit #parser-form': function(e) {
    var input, jsonFeed;
    e.preventDefault();
    input = $('#parser-json-feed');
    jsonFeed = input.val();
    return Meteor.call('parseFacebookFeed', jsonFeed, function(error, result) {
      if (error != null) {
        alert("Something went wrong: " + error.reason);
      } else {
        alert("Done!\n- New users: " + result.newUsers + "\n- Updated users: " + result.updatedUsers + "\n- New posts: " + result.newPosts + "\n- Updated posts: " + result.updatedPosts + "\n- Changed/new comments: " + result.changedComments);
      }
      return input.val('');
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/massivites-parser/lib/both/routes.coffee.js                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {
  var AdminParserController;
  Router.onBeforeAction(Router._filters.isAdmin, {
    only: ['parserPage']
  });
  AdminParserController = RouteController.extend({
    template: getTemplate('parserPage'),
    fastRender: true
  });
  return Router.route('/parser', {
    name: 'parserPage',
    controller: AdminParserController
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/massivites-parser/lib/both/base.coffee.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
adminNav.push({
  route: 'parserPage',
  label: 'Parser'
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
