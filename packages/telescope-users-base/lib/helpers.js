////////////////////
//  User Getters  //
////////////////////

/**
 * Get a user's username (unique, no special characters or spaces)
 * @param {Object} user
 */
Users.getUserName = function (user) {
  try{
    if (user.username)
      return user.username;
    if (user && user.services && user.services.twitter && user.services.twitter.screenName)
      return user.services.twitter.screenName;
  }
  catch (error){
    console.log(error);
    return null;
  }
};
Users.helpers({getUserName: function () {return Users.getUserName(this);}});
Users.getUserNameById = function (userId) {return Users.getUserName(Meteor.users.findOne(userId))}; 

/**
 * Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getDisplayName = function (user) {
  if (typeof user === "undefined") {
    return "";
  } else {
    return (user.telescope && user.telescope.displayName) ? user.telescope.displayName : Users.getUserName(user);
  }
};
Users.helpers({getDisplayName: function () {return Users.getDisplayName(this);}});
Users.getDisplayNameById = function (userId) {return Users.getDisplayName(Meteor.users.findOne(userId));};

/**
 * Get a user's profile URL
 * @param {Object} user
 */
Users.getProfileUrl = function (user) {
  return Users.getProfileUrlBySlugOrId(user.telescope.slug);
};
Users.helpers({getProfileUrl: function () {return Users.getProfileUrl(this);}});

/**
 * Get a user's profile URL by slug or Id
 * @param {String} slugOrId
 */
Users.getProfileUrlBySlugOrId = function (slugOrId) {
  return Telescope.utils.getRouteUrl('user_profile', {_idOrSlug: slugOrId});
};

/**
 * Get a user's Twitter name
 * @param {Object} user
 */
Users.getTwitterName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if(Telescope.utils.checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return null;
};
Users.helpers({getTwitterName: function () {return Users.getTwitterName(this);}});
Users.getTwitterNameById = function (userId) {return Users.getTwitterName(Meteor.users.findOne(userId));};

/**
 * Get a user's GitHub name
 * @param {Object} user
 */
Users.getGitHubName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if(Telescope.utils.checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(Telescope.utils.checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return null;
};
Users.helpers({getGitHubName: function () {return Users.getGitHubName(this);}});
Users.getGitHubNameById = function (userId) {return Users.getGitHubName(Meteor.users.findOne(userId));};

/**
 * Get a user's email
 * @param {Object} user
 */
Users.getEmail = function (user) {
  if(user.telescope && user.telescope.email){
    return user.telescope.email;
  }else{
    return null;
  }
};
Users.helpers({getEmail: function () {return Users.getEmail(this);}});
Users.getEmailById = function (userId) {return Users.getEmail(Meteor.users.findOne(userId));};

/**
 * Get a user's email hash
 * @param {Object} user
 */
Users.getEmailHash = function (user) {
  // has to be this way to work with Gravatar
  return Gravatar.hash(Users.getEmail(user));
};
Users.helpers({getEmailHash: function () {return Users.getEmailHash(this);}});
Users.getEmailHashById = function (userId) {return Users.getEmailHash(Meteor.users.findOne(userId));};

/**
 * Check if a user's profile is complete
 * @param {Object} user
 */
Users.userProfileComplete = function (user) {
  for (var i = 0; i < Telescope.callbacks.profileCompletedChecks.length; i++) {
    if (!Telescope.callbacks.profileCompletedChecks[i](user)) {
      return false;
    }
  }
  return true;
};
Users.helpers({userProfileComplete: function () {return Users.userProfileComplete(this);}});
Users.userProfileCompleteById = function (userId) {return Users.userProfileComplete(Meteor.users.findOne(userId));};

///////////////////
// Other Helpers //
///////////////////

Users.findLast = function (user, collection) {
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});
};

Users.timeSinceLast = function (user, collection){
  var now = new Date().getTime();
  var last = this.findLast(user, collection);
  if(!last)
    return 999; // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now-last.createdAt)/1000));
};

Users.numberOfItemsInPast24Hours = function (user, collection) {
  var mNow = moment();
  var items = collection.find({
    userId: user._id,
    createdAt: {
      $gte: mNow.subtract(24, 'hours').toDate()
    }
  });
  return items.count();
};

Users.getUserSetting = function (settingName, defaultValue, user) {
  user = user || Meteor.user();
  defaultValue = defaultValue || null;
  if (user.telescope && user.telescope.settings) {
    var settingValue = this.getProperty(user.telescope.settings, settingName);
    return (settingValue === null) ? defaultValue : settingValue;
  } else {
    return defaultValue;
  }
};

Users.setUserSetting = function (settingName, value, userArgument) {
  // note: for some very weird reason, doesn't work when called from Accounts.onCreateUser

  var user;

  if(Meteor.isClient){
    user = (typeof userArgument === "undefined") ? Meteor.user() : userArgument; // on client, default to current user
  }else if (Meteor.isServer){
    user = userArgument; // on server, use argument
  }
  if(!user)
    throw new Meteor.Error(500, 'User not defined');

  Meteor.call('setUserSetting', settingName, value, user);
};

Meteor.methods({
  setUserSetting: function (settingName, value, user) {
    // console.log('Setting user setting "' + setting + '" to "' + value + '" for ' + Users.getUserName(user));
    var field = 'telescope.settings.'+settingName;
    var modifier = {$set: {}};
    modifier.$set[field] = value;
    Meteor.users.update(user._id, modifier);
  }
});

Users.getProperty = function (object, property) {
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] === "undefined") ? null : this.getProperty(object[parent], array.join('.'));
  }else{
    // else return property
    return object[array[0]];
  }
};

/**
 * Build Users subscription with filter, sort, and limit args.
 * @param {String} filterBy
 * @param {String} sortBy
 * @param {Number} limit
 */
Users.getSubParams = function(filterBy, sortBy, limit) {
  var find = {},
      sort = {createdAt: -1};

  switch(filterBy){
    case 'invited':
      // consider admins as invited
      find = { $or: [{ isInvited: true }, { isAdmin: true }]};
      break;
    case 'uninvited':
      find = { $and: [{ isInvited: false }, { isAdmin: false }]};
      break;
    case 'admin':
      find = { isAdmin: true };
      break;
  }

  switch(sortBy){
    case 'username':
      sort = { username: 1 };
      break;
    case 'karma':
      sort = { karma: -1 };
      break;
    case 'postCount':
      sort = { postCount: -1 };
      break;
    case 'commentCount':
      sort = { commentCount: -1 };
      break;
    case 'invitedCount':
      sort = { invitedCount: -1 };
  }
  return {
    find: find,
    options: { sort: sort, limit: limit }
  };
};


Users.updateAdmin = function (userId, admin) {
  this.update(userId, {$set: {isAdmin: admin}});
};

Users.adminUsers = function () {
  return this.find({isAdmin : true}).fetch();
};

Users.getCurrentUserEmail = function () {
  return Meteor.user() ? Users.getEmail(Meteor.user()) : '';
};