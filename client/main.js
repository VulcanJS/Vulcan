// Session variables
Session.set('initialLoad', true);
Session.set('categorySlug', null);
Session.set('today', new Date());
Session.set('view', 'top');
Session.set('postsLimit', getSetting('postsPerPage', 2));

// Subscriptions

// note: here we only subscribe to subscriptions that we need to be available all the time.
// For subscriptions depending on specific pages, see the router. 

// TODO: add session variable that tracks when all global subscriptions have loaded

// Settings
Meteor.subscribe('settings', function(){
  // runs once after settings have loaded
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// Categories
Meteor.subscribe('categories');

// Current User
// We need to subscribe to the currentUser subscription because by itself, 
// Meteor doesn't send all the user properties that we need
Meteor.subscribe('currentUser');

// Notifications - only load if user is logged in
if(Meteor.user() != null)
  Meteor.subscribe('notifications');

// Posts Lists

// postsSubs = {}

// postsSubs.top = postListSubscription(selectPosts, sortPosts('score'), 10);

// postsSubs.new = postListSubscription(selectPosts, sortPosts('submitted'), 10);

// // postsSubs.best = postListSubscription(selectPosts, sortPosts('baseScore'), 10);

// postsSubs.pending = postListSubscription(function(){
//     return selectPosts({status: STATUS_PENDING})
//   }, sortPosts('createdAt'), 10);

// postsSubs.category = postListSubscription(function(){
//     return selectPosts({status: STATUS_APPROVED, slug: Session.get('categorySlug')})
//   }, sortPosts('score'), 10);