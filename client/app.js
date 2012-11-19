// HELPERS

// Workaround for the fact that you cannot store objects in
// Session variables. Is used by app.js so needs to come first. 

sessionSetObject=function(name, value){
  Session.set(name, JSON.stringify(value));
}
sessionGetObject=function(name){
  var data = Session.get(name);
  return data && JSON.parse(data);
}
getSetting = function(setting){
  var settings=Settings.find().fetch()[0];
  if(settings){
    return settings[setting];
  }
  return '';
}
clearSeenErrors = function(){
  Errors.update({seen:true}, {$set: {show:false}}, {multi:true});
}
// SUBSCRIPTIONS

// ** Errors **
// Local (client-only) collection

Errors = new Meteor.Collection(null);

// ** Settings **

Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){

  // runs once on site load

  window.settingsLoaded=true;

  window.Backbone.history.start({pushState: true});

});

// ** Users **

Meteor.subscribe('currentUser');
Meteor.subscribe('allUsers');


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

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;
FIND_APPROVED={$or: [{status: {$exists : false}}, {status: STATUS_APPROVED}]};

// TOP page
TOP_PAGE_PER_PAGE = 10;
TOP_PAGE_SORT = {score: -1};
Session.set('topPageLimit', TOP_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.set('topPostsReady', false);
  Meteor.subscribe('posts', FIND_APPROVED, {
    sort: TOP_PAGE_SORT, 
    limit: Session.get('topPageLimit')
  }, function() {
    Session.set('topPostsReady', true);
  });
});
var topPosts = function() {
  var orderedPosts = Posts.find(FIND_APPROVED, {sort: TOP_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('topPageLimit'));
}

// NEW page
NEW_PAGE_PER_PAGE = 10;
NEW_PAGE_SORT = {submitted: -1};
Session.set('newPageLimit', NEW_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.set('newPostsReady', false);
  // note: should use FIND_APPROVED, but this is a temporary workaround because of bug
  Meteor.subscribe('posts', {userId:{$exists: true},$or: [{status: {$exists : false}}, {status: STATUS_APPROVED}]}, {
    sort: NEW_PAGE_SORT, 
    limit: Session.get('newPageLimit')
  }, function() {
    Session.set('newPostsReady', true);
  });
});
var newPosts = function() {
  var orderedPosts = Posts.find(FIND_APPROVED, {sort: NEW_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('newPageLimit'));
}

PENDING_FIND = {$or: [{status: STATUS_PENDING}, {status: STATUS_REJECTED}]};
// PENDING_FIND = {};
// PENDING page
Meteor.autosubscribe(function() {
  Session.set('pendingPostsReady', false);
  Meteor.subscribe('posts', PENDING_FIND, {
    sort: NEW_PAGE_SORT, 
    limit: Session.get('newPageLimit')
  }, function() {
    Session.set('pendingPostsReady', true);
  });
});
var pendingPosts = function() {
  var orderedPosts = Posts.find( PENDING_FIND, {sort: NEW_PAGE_SORT});
  return limitDocuments(orderedPosts, Session.get('newPageLimit'));
}

// DIGEST page
DIGEST_PAGE_PER_PAGE = 5;
DIGEST_PAGE_SORT = {score: -1};
var digestPageFind = function(mDate) {
  var find = {
    submitted: {
      $gte: mDate.startOf('day').valueOf(), 
      $lt: mDate.endOf('day').valueOf()
    }
  };
  find=_.extend(find, FIND_APPROVED);
  return find;
}

Session.set('digestPageLimit', DIGEST_PAGE_PER_PAGE);
Meteor.autosubscribe(function() {
  Session.set('digestPostsReady', false);
  
  var mDate = moment(sessionGetObject('currentDate'));
  // start yesterday, and subscribe to 3 days
  mDate.add('days', -1);
  for (var i = 0; i < 3; i++) {
    Meteor.subscribe('posts', digestPageFind(mDate), {
      sort: DIGEST_PAGE_SORT, 
      limit: Session.get('digestPageLimit')
    }, function() {
      Session.set('digestPostsReady', true);
    });
    mDate.add('days', 1);
  }
});
var digestPosts = function() {
  var mDate = moment(sessionGetObject('currentDate'))
  var orderedPosts = Posts.find(digestPageFind(mDate), {sort: DIGEST_PAGE_SORT});
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
    Session.set('commentReady', true);
  });
});