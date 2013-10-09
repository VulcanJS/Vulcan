// Session variables
Session.set('initialLoad', true);
Session.set('currentDate', new Date());
Session.set('categorySlug', null);

// Subscriptions

// note: here we only subscribe to subscriptions that we need to be available all the time.
// For subscriptions depending on specific pages, see the router. 

// TODO: add session variable that tracks once all subscriptions here have loaded

// Settings
Meteor.subscribe('settings', function(){
  // runs once after settings have loaded
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// Categories
Meteor.subscribe('categories');

// Current User
// we need to subscribe to the currentUser subscription because by default, 
//Meteor doesn't send all the user properties that we need
Meteor.subscribe('currentUser');

// Notifications - only load if user is logged in
if(Meteor.userId() != null){
  Meteor.subscribe('notifications');
}

// Posts Lists
STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

// put it all together with pagination
postListSubscription = function(find, options, per_page) {
  var handle = Meteor.subscribeWithPagination('paginatedPosts', find, options, per_page);
  handle.fetch = function() {
    var ourFind = _.isFunction(find) ? find() : find;
    return limitDocuments(Posts.find(ourFind, options), handle.loaded());
  }
  return handle;
}

// note: the "name" property is for internal debugging purposes only
selectTop = function() {
  return selectPosts({name: 'top', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
topPostsHandle = postListSubscription(selectTop, sortPosts('score'), 10);

selectNew = function() {
  return selectPosts({name: 'new', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
newPostsHandle = postListSubscription(selectNew, sortPosts('submitted'), 10);  

selectBest = function() {
  return selectPosts({name: 'best', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
bestPostsHandle = postListSubscription(selectBest, sortPosts('baseScore'), 10);  

selectPending = function() {
  return selectPosts({name: 'pending', status: STATUS_PENDING, slug: Session.get('categorySlug')});
}
pendingPostsHandle = postListSubscription(selectPending, sortPosts('createdAt'), 10);
