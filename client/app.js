Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

// ** Client-side helpers **

sessionSetObject=function(name, value){
  Session.set(name, JSON.stringify(value));
}
sessionGetObject=function(name){
  var data = Session.get(name);
  return data && JSON.parse(data);
}
$.fn.exists = function () {
    return this.length !== 0;
}

// ** Users **
Meteor.subscribe('currentUser');
Meteor.subscribe('allUsers');

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

// ** Notifications **
// Only load if user is logged in

var Notifications = new Meteor.Collection('notifications');
if(Meteor.user()){
  Meteor.subscribe('notifications');
}


// ** Posts **
// We have a few subscriptions here, for the various ways we load posts
//
// The advantage is that
//   a) we can change pages a lot quicker
//     XXX: and we can animate between them (todo)
//   b) we know when an individual page is ready

Posts = new Meteor.Collection('posts');

// TOP page
TOP_PAGE_PER_PAGE = 10;
TOP_PAGE_SORT = {score: -1};
Session.set('topPageLimit', TOP_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.get('topPostsReady', false);
  Meteor.subscribe('posts', {}, {
    sort: TOP_PAGE_SORT, 
    limit: Session.get('topPageLimit')
  }, function() {
    Session.set('topPostsReady', true);
  });
});
var topPosts = function() {
  var orderedPosts = Posts.find({}, {sort: TOP_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('topPageLimit'));
}

// NEW page
NEW_PAGE_PER_PAGE = 10;
NEW_PAGE_SORT = {submitted: -1};
Session.set('newPageLimit', NEW_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.get('newPostsReady', false);
  Meteor.subscribe('posts', {}, {
    sort: NEW_PAGE_SORT, 
    limit: Session.get('newPageLimit')
  }, function() {
    Session.set('newPostsReady', true);
  });
});
var newPosts = function() {
  var orderedPosts = Posts.find({}, {sort: NEW_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('newPageLimit'));
}

// DIGEST page
DIGEST_PAGE_PER_PAGE = 5;
DIGEST_PAGE_SORT = {score: -1};
var digestPageFind = function() {
  var mDate = moment(sessionGetObject('currentDate'));
  return {submitted: {
    $gte: mDate.startOf('day').valueOf(), 
    $lt: mDate.endOf('day').valueOf()
  }};
}

Session.set('digestPageLimit', DIGEST_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.get('digestPostsReady', false);
  Meteor.subscribe('posts', digestPageFind(), {
    sort: DIGEST_PAGE_SORT, 
    limit: Session.get('digestPageLimit')
  }, function() {
    Session.set('digestPostsReady', true);
  });
});
var digestPosts = function() {
  var orderedPosts = Posts.find(digestPageFind(), {sort: DIGEST_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('digestPageLimit'));
}

// SINGLE post, e.g. post_page
Meteor.autosubscribe(function() {
  Session.set('postReady', false);
  Meteor.subscribe('post', Session.get('selectedPostId'), function() {
    Session.set('postReady', true);
  })
});


// ** Categories **

Categories = new Meteor.Collection('categories');
Meteor.subscribe('categories');


// ** Comments **
// Collection depends on selectedPostId and selectedCommentId session variable

Session.set('selectedPostId', null);
Comments = new Meteor.Collection('comments');
Meteor.autosubscribe(function() {
  var query = { $or : [ { post : Session.get('selectedPostId') } , { _id : Session.get('selectedCommentId') } ] };
  Meteor.subscribe('comments', query, function() {
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
Handlebars.registerHelper('canEdit', function(collectionName, action) {
  var action = (typeof action !== 'string') ? null : action;
  var collection = (typeof collectionName !== 'string') ? Posts : eval(collectionName);
  var itemId = (collectionName==="Posts") ? Session.get('selectedPostId') : Session.get('selectedCommentId');
  var item=collection.findOne(itemId);
  return item && canEdit(Meteor.user(), item, action);
});