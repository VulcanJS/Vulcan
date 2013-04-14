// Session variables
Session.set('initialLoad', true);
Session.set('currentDate', new Date());
Session.set('categorySlug', null);

// Settings
Meteor.subscribe('settings', function(){
  // runs once on site load
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// Categories
Meteor.subscribe('categories');

// Users
Meteor.subscribe('currentUser');
Meteor.subscribe('allUsers');

// Notifications - only load if user is logged in
if(Meteor.userId() != null){
  Meteor.subscribe('notifications');
}

// Posts
// We have a few subscriptions here, for the various ways we load posts
//
// The advantage is that
//   a) we can change pages a lot quicker
//     XXX: and we can animate between them (todo)
//   b) we know when an individual page is ready

// Single Post
Meteor.autorun(function() {
  Meteor.subscribe('singlePost', Session.get('selectedPostId'));
});

// Digest
Meteor.autorun(function() {
  digestHandle = Meteor.subscribe('postDigest', Session.get('currentDate'));
});

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

// Comments
// Collection depends on selectedPostId and selectedCommentId session variable

Session.set('selectedPostId', null);
Meteor.autosubscribe(function() {
  var query = { $or : [ { post : Session.get('selectedPostId') } , { _id : Session.get('selectedCommentId') } ] };
  Meteor.subscribe('comments', query, function() {
    Session.set('commentReady', true);
  });
});
