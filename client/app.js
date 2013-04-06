Session.set('initialLoad', true);
Session.set('currentDate', new Date());

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

Notifications = new Meteor.Collection('notifications');
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

Meteor.autorun(function() {
  Meteor.subscribe('singlePost', Session.get('selectedPostId'));
});

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

// build find query object
findPosts = function(properties){
  var find = {};

  // Status
  if(properties.status)
    find = _.extend(find, {status: properties.status});

  // Slug
  if(properties.slug)
    find = _.extend(find, {'categories.slug': properties.slug});
  
  // Date
  if(properties.date){
    find = _.extend(find, {submitted: 
      {
        $gte: moment(properties.date).startOf('day').valueOf(), 
        $lt: moment(properties.date).endOf('day').valueOf()
      }
    });
  }

  console.log("*"+properties.name+"* find query: --------------")
  console.log(find)

  return find;
}

// build sort query object
sortPosts = function(sortProperty){
  var sort = {sort: {sticky: -1}};
  sort.sort[sortProperty] = -1;
  return sort;
}

// put it all together with pagination
postListSubscription = function(find, options, per_page) {
  // console.log('calling postListSubscription')
  var handle = Meteor.subscribeWithPagination('paginatedPosts', find, options, per_page);
  handle.fetch = function() {
    return limitDocuments(Posts.find(find, options), handle.loaded());
  }
  return handle;
}


var findTop = function() {
  return findPosts({name: 'top', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
var findNew = function() {
  return findPosts({name: 'new', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
var findBest = function() {
  return findPosts({name: 'best', status: STATUS_APPROVED, slug: Session.get('categorySlug')});
}
var findPending = function() {
  return findPosts({name: 'pending', status: STATUS_PENDING, slug: Session.get('categorySlug')});
}
var findDigest = function() {
  return findPosts({name: 'digest', status: STATUS_APPROVED,  date: Session.get('currentDate') });
}

// note: the "name" property is for internal debugging purposes only
topPostsHandle = postListSubscription(findTop, sortPosts('score'), 10);

newPostsHandle = postListSubscription(findNew, sortPosts('submitted'), 10);  

bestPostsHandle = postListSubscription(findBest, sortPosts('baseScore'), 10);  

pendingPostsHandle = postListSubscription(findPending, sortPosts('createdAt'), 10);

digestHandle = postListSubscription(findDigest, sortPosts('score'), 10);  

// digest subscriptions
// DIGEST_PRELOADING = 3;
// var digestHandles = {}
// var dateHash = function(mDate) {
//   return mDate.format('DD-MM-YYYY');
// }
// var currentMDateForDigest = function() {
//   return moment(Session.get('currentDate')).startOf('day');
// }
// currentDigestHandle = function() {
//   return digestHandles[dateHash(currentMDateForDigest())];
// }

// we use autorun here, because we DON'T want meteor to automatically
// unsubscribe for us
// Meteor.autorun(function() {
//   var daySubscription = function(mDate) {
//     console.log('calling daySubscription')
//     var find = _.extend({
//         submitted: {
//           $gte: mDate.startOf('day').valueOf(), 
//           $lt: mDate.endOf('day').valueOf()
//         }
//       }, findPosts({status: STATUS_APPROVED}));
//     // note: the digest is ranked by baseScore and not score because we want the posts with the most votes of the day
//     // independantly of age
//     var options = {sort: {baseScore: -1}};
    
//     // we aren't ever going to paginate this sub, but we'll use pSub
//     // so we have a reactive loading() function 
//     // (grr... https://github.com/meteor/meteor/pull/273)
//     return postListSubscription(find, options, 50);
//   };
  
//   // take it to the start of the day.
//   var mDate = currentMDateForDigest();
//   var firstDate = moment(mDate).subtract('days', DIGEST_PRELOADING);
//   var lastDate = moment(mDate).add('days', DIGEST_PRELOADING);
  
//   // first unsubscribe all the subscriptions that fall outside of our current range
//   _.each(digestHandles, function(handle, hash) {
//     var mDate = moment(hash, 'DD-MM-YYYY');
//     if (mDate < firstDate || mDate > lastDate) {
//       // console.log('unsubscribing digest for ' + mDate.toString())
//       handle.stop();
//       delete digestHandles[dateHash(mDate)];
//     }
//   });
  
//   // set up a sub for each day for the DIGEST_PRELOADING days before and after
//   // but we want to be smart about it --  
//   for (mDate = firstDate; mDate < lastDate; mDate.add('days',1 )) {
//     if (! digestHandles[dateHash(mDate)]) {
//       // console.log('subscribing digest for ' + mDate.toString());
//       digestHandles[dateHash(mDate)] = daySubscription(mDate);
//     }
//   }
// });




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
