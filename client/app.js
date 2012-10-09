// ** Client-side helpers **

sessionSetObject=function(name, value){
  Session.set(name, JSON.stringify(value));
}
sessionGetObject=function(name){
  return JSON.parse(Session.get(name));
}
$.fn.exists = function () {
    return this.length !== 0;
}


// ** Errors **
// Local (client-only) collection

Errors = new Meteor.Collection(null);


// ** Settings **

Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){

  // runs once on site load

  window.settingsLoaded=true;

  if((proxinoKey=getSetting('proxinoKey'))){
    Proxino.key = proxinoKey;
    Proxino.track_errors();
  }

  // window.Router = new SimpleRouter();
  window.Backbone.history.start({pushState: true});

});


// ** Users **

Meteor.subscribe('users');


// ** Notifications **
// Only load if user is logged in

if(Meteor.user()){
  Notifications = new Meteor.Collection('notifications');
  Meteor.subscribe('notifications');
}


// ** Posts **
// Collection depends on postsView object

Posts = new Meteor.Collection('posts');

var postsView={
  find: {},
  sort: {submitted: -1},
  skip:0,
  postsPerPage:10,
  limit:1
}
sessionSetObject('postsView', postsView);

Meteor.autosubscribe(function() {
  var view=sessionGetObject('postsView');
  Meteor.subscribe('posts', view, function() {
    // collectionArray=Posts.find().fetch();
    // console.log('--------- Publishing ----------');
    // console.log('postsView: ', view);
    //   for(i=0;i<collectionArray.length;i++){
    //     console.log('- '+collectionArray[i].headline);
    //   }
    // console.log('found '+collectionArray.length+' posts');
  });
});


// ** Categories **

Categories = new Meteor.Collection('categories');
Meteor.subscribe('categories');


// ** Comments **
// Collection depends on selectedPostId session variable

Session.set('selectedPostId', null);
Comments = new Meteor.Collection('comments');
Meteor.autosubscribe(function() {
  Meteor.subscribe('comments', Session.get('selectedPostId'), function() {
    //
  });
});


// ** Handlebars helpers **

Handlebars.registerHelper('canView', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canView(Meteor.user(), action);
});
Handlebars.registerHelper('canPost', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canPost(Meteor.user(), action);
});
Handlebars.registerHelper('canComment', function(action) {
  var action=(typeof action !== 'string') ? null : action;
  return canComment(Meteor.user(), action);
});
Handlebars.registerHelper('canUpvote', function(collection, action) {
  var action=(typeof action !== 'string') ? null : action;
  return canUpvote(Meteor.user()), collection, action;
});
Handlebars.registerHelper('canDownvote', function(collection, action) {
  var action=(typeof action !== 'string') ? null : action;
  return canDownvote(Meteor.user(), collection, action);
});
Handlebars.registerHelper('isAdmin', function(showError) {
  if(isAdmin(Meteor.user())){
    return true;
  }else{
    if((typeof showError === "string") && (showError === "true"))
      throwError('Sorry, you do not have access to this page');
    return false;
  }
});