Session.set('initialLoad', true);
Session.set('currentDate', new Date());
Session.set('categorySlug', null);

l=function(s){
  console.log(s);
}

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


// ** Settings **

Meteor.subscribe('settings', function(){

  // runs once on site load
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// ** Categories **

Meteor.subscribe('categories');

// ** Users **

Meteor.subscribe('currentUser');
Meteor.subscribe('allUsers');


// ** Notifications **
// Only load if user is logged in

if(Meteor.userId() != null){
  Meteor.subscribe('notifications');
}

// ** Posts **
// We have a few subscriptions here, for the various ways we load posts
//
// The advantage is that
//   a) we can change pages a lot quicker
//     XXX: and we can animate between them (todo)
//   b) we know when an individual page is ready


Meteor.autorun(function() {
  Meteor.subscribe('singlePost', Session.get('selectedPostId'));
});


STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

// put it all together with pagination
postListSubscription = function(find, options, per_page) {
  console.log('calling postListSubscription')
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
selectNew = function() {
  return selectPosts({name: 'new', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
selectBest = function() {
  return selectPosts({name: 'best', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
selectPending = function() {
  return selectPosts({name: 'pending', status: STATUS_PENDING, slug: Session.get('categorySlug')});
}

topPostsHandle = postListSubscription(selectTop, sortPosts('score'), 10);

newPostsHandle = postListSubscription(selectNew, sortPosts('submitted'), 10);  

bestPostsHandle = postListSubscription(selectBest, sortPosts('baseScore'), 10);  

pendingPostsHandle = postListSubscription(selectPending, sortPosts('createdAt'), 10);

Meteor.autorun(function() {
  digestHandle = Meteor.subscribe('postDigest', Session.get('currentDate'));
});

// ** Comments **
// Collection depends on selectedPostId and selectedCommentId session variable

Session.set('selectedPostId', null);
Meteor.autosubscribe(function() {
  var query = { $or : [ { post : Session.get('selectedPostId') } , { _id : Session.get('selectedCommentId') } ] };
  Meteor.subscribe('comments', query, function() {
    Session.set('commentReady', true);
  });
});
