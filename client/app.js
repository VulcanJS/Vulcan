Session.set('initialLoad', true);

// HELPERS
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
  analyticsInit();
  Session.set('settingsLoaded',true);
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
DIGEST_PAGE_PER_PAGE = 5;

var postListSubscription = function(find, options, per_page) {
  var handle = paginatedSubscription(per_page, 'paginatedPosts', find, options);
  handle.fetch = function() {
    return limitDocuments(Posts.find(find, options), handle.loaded());
  }
  return handle;
}

var topPostsHandle = postListSubscription(FIND_APPROVED, {sort: {score: -1}}, 10);
var newPostsHandle = postListSubscription(FIND_APPROVED, {sort: {submitted: -1}}, 10);
var bestPostsHandle = postListSubscription(FIND_APPROVED, {sort: {baseScore: -1}}, 10);
var pendingPostsHandle = postListSubscription(
  {$or: [{status: STATUS_PENDING}, {status: STATUS_REJECTED}]}, 
  {sort: {score: -1}}, 
  10
);

// setupPostSubscription('digestPosts', {
//   find: function() {
//     var mDate = moment(Session.get('currentDate'));
//     var find = {
//       submitted: {
//         $gte: mDate.startOf('day').valueOf(), 
//         $lt: mDate.endOf('day').valueOf()
//       }
//     };
//     find=_.extend(find, FIND_APPROVED);
//     return find;
//   },
//   sort: {score: -1}
//   ,perPage: DIGEST_PAGE_PER_PAGE
// });

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