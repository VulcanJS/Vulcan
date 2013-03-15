Session.set('initialLoad', true);

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
// Local (client-only) collection

Errors = new Meteor.Collection(null);

// ** Settings **

Settings = new Meteor.Collection('settings');
Meteor.subscribe('settings', function(){

  // runs once on site load
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// ** Categories **

Categories = new Meteor.Collection('categories');
Meteor.subscribe('categories');

// ** Users **

Meteor.subscribe('currentUser');
Meteor.subscribe('allUsers');


// ** Notifications **
// Only load if user is logged in

var Notifications = new Meteor.Collection('notifications');
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

Posts = new Meteor.Collection('posts');


STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

var queryFind = function(status, slug){
  var find = {};

  // build find query starting with the status
  switch(status){
    case STATUS_APPROVED:
      find = {
        $or: [
          {status: {$exists : false}},
          {status: STATUS_APPROVED}
        ]
      };
    break;
    case STATUS_PENDING:
      find = {status: STATUS_PENDING}
    break;
    case STATUS_REJECTED:
      find = {status: STATUS_REJECTED}
    break;
  }

  // if a category slug is defined, modify selector

  // DOESN'T WORK FOR SOME REASON
  if(slug){
    console.log('category slug: ', slug);
    find={
      $and : [
        find,
        {'categories.slug': slug}
      ]
    }; 
  }
  // console.log(find)
  return find;
}

var sortBy = function(sortProperty){
  var sortBy = {sort: {sticky: -1}};
  sortBy.sort[sortProperty] = -1;
  return sortBy;
}

var postListSubscription = function(find, options, per_page) {
  var handle = paginatedSubscription(per_page, 'paginatedPosts', find, options);
  handle.fetch = function() {
    return limitDocuments(Posts.find(find, options), handle.loaded());
  }
  return handle;
}

FIND_APPROVED = function() {
  return queryFind(STATUS_APPROVED, Session.get('categorySlug'));
}
FIND_PENDING = function() {
  return queryFind(STATUS_PENDING, Session.get('categorySlug'));
}

var topPostsHandle;
var newPostsHandle;
var bestPostsHandle;
var pendingPostsHandle;

Meteor.autorun(function() {
  topPostsHandle = postListSubscription(FIND_APPROVED(), sortBy('score'), 10);
  newPostsHandle = postListSubscription(FIND_APPROVED(), sortBy('submitted'), 10);
  bestPostsHandle = postListSubscription(FIND_APPROVED(), sortBy('baseScore'), 10);
  pendingPostsHandle = postListSubscription(FIND_PENDING(), sortBy('createdAt'), 10);
});

// digest subscriptions
DIGEST_PRELOADING = 3;
var digestHandles = {}
var dateHash = function(mDate) {
  return mDate.format('DD-MM-YYYY');
}
var currentMDateForDigest = function() {
  return moment(Session.get('currentDate')).startOf('day');
}
var currentDigestHandle = function() {
  return digestHandles[dateHash(currentMDateForDigest())];
}

// we use autorun here, because we DON'T want meteor to automatically
// unsubscribe for us
Meteor.autorun(function() {
  var daySubscription = function(mDate) {
    var find = _.extend({
        submitted: {
          $gte: mDate.startOf('day').valueOf(), 
          $lt: mDate.endOf('day').valueOf()
        }
      }, FIND_APPROVED);
    // note: the digest is ranked by baseScore and not score because we want the posts with the most votes of the day
    // independantly of age
    var options = {sort: {baseScore: -1}};
    
    // we aren't ever going to paginate this sub, but we'll use pSub
    // so we have a reactive loading() function 
    // (grr... https://github.com/meteor/meteor/pull/273)
    return postListSubscription(find, options, 50);
  };
  
  // take it to the start of the day.
  var mDate = currentMDateForDigest();
  var firstDate = moment(mDate).subtract('days', DIGEST_PRELOADING);
  var lastDate = moment(mDate).add('days', DIGEST_PRELOADING);
  
  // first unsubscribe all the subscriptions that fall outside of our current range
  _.each(digestHandles, function(handle, hash) {
    var mDate = moment(hash, 'DD-MM-YYYY');
    if (mDate < firstDate || mDate > lastDate) {
      // console.log('unsubscribing digest for ' + mDate.toString())
      handle.stop();
      delete digestHandles[dateHash(mDate)];
    }
  });
  
  // set up a sub for each day for the DIGEST_PRELOADING days before and after
  // but we want to be smart about it --  
  for (mDate = firstDate; mDate < lastDate; mDate.add('days',1 )) {
    if (! digestHandles[dateHash(mDate)]) {
      // console.log('subscribing digest for ' + mDate.toString());
      digestHandles[dateHash(mDate)] = daySubscription(mDate);
    }
  }
});




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
