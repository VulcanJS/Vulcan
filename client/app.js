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
TOP_PAGE_PER_PAGE = 10;
NEW_PAGE_PER_PAGE = 10;
BEST_PAGE_PER_PAGE = 10;
PENDING_PAGE_PER_PAGE = 10;
DIGEST_PAGE_PER_PAGE = 5;

// name <- the name of various session vars that will be set:
//  - 'nameReady' <- is the subscription loading or ready?
//  - 'nameLimit' <- how many of this type are we currently displaying?
// options:
//   - find <- how to find the items
//   - sort <- how to sort them
//   - perPage <- how many to display per-page
//   - 
postsForSub = {};
setupPostSubscription = function(name, options) {
  var readyName = name + 'Ready';
  var limitName = name + 'Limit';
  
  if (options.perPage && ! Session.get(limitName))
    Session.set(limitName, options.perPage);
  
  // setup the subscription
  Meteor.autosubscribe(function() {
    Session.set(readyName, false);

    var findOptions = {
      sort: options.sort,
      limit: options.perPage && Session.get(limitName) 
    };
    
    var find = _.isFunction(options.find) ? options.find() : options.find;
    Meteor.subscribe('posts', find || {}, findOptions, name, function() {
      Session.set(readyName, true);
    });
  });
  
  // setup a function to find the relevant posts (+deal with mm's lack of limit)
  postsForSub[name] = function() {
    var find = _.isFunction(options.find) ? options.find() : options.find;
    var orderedPosts = Posts.find(find || {}, {sort: options.sort});
    if (options.perPage) {
      return limitDocuments(orderedPosts, Session.get(limitName));
    } else {
      return orderedPosts;
    }
  };
}

// if(Session.get('selectedPostId')){
  setupPostSubscription('singlePost', {
    find: function() { return Session.get('selectedPostId'); }
  });
// }

setupPostSubscription('topPosts', {
  find: FIND_APPROVED,
  sort: {score: -1},
  perPage: TOP_PAGE_PER_PAGE
});

setupPostSubscription('newPosts', {
  find: FIND_APPROVED,
  sort: {submitted: -1},
  perPage: NEW_PAGE_PER_PAGE
});

setupPostSubscription('bestPosts', {
  find: FIND_APPROVED,
  sort: {baseScore: -1},
  perPage: NEW_PAGE_PER_PAGE
});

setupPostSubscription('pendingPosts', {
  find: {$or: [{status: STATUS_PENDING}, {status: STATUS_REJECTED}]},
  sort: {score: -1},
  perPage: PENDING_PAGE_PER_PAGE
});

setupPostSubscription('digestPosts', {
  find: function() {
    var mDate = moment(Session.get('currentDate'));
    var find = {
      submitted: {
        $gte: mDate.startOf('day').valueOf(), 
        $lt: mDate.endOf('day').valueOf()
      }
    };
    find=_.extend(find, FIND_APPROVED);
    return find;
  },
  sort: {score: -1}
  ,perPage: DIGEST_PAGE_PER_PAGE
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