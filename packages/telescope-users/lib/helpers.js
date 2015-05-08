///////////////////
// Users Helpers //
///////////////////



Users.updateAdmin = function (userId, admin) {
  this.update(userId, {$set: {isAdmin: admin}});
};


Users.adminUsers = function () {
  return this.find({isAdmin : true}).fetch();
};

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

Users.getDisplayName = function (user) {
  return (user.telescope && user.telescope.displayName) ? user.telescope.displayName : Users.getUserName(user);
};

Users.getDisplayNameById = function (userId) {
  return this.getDisplayName(Meteor.users.findOne(userId));
};

Users.getAuthorName = function(item) {
  var user = Meteor.users.findOne(item.userId);
  return typeof user === 'undefined' ? '' : Users.getDisplayName(user);
};

Users.getProfileUrl = function (user) {
  return this.getProfileUrlBySlugOrId(user.telescope.slug);
};

Users.getProfileUrlBySlugOrId = function (slugOrId) {
  return Telescope.utils.getRouteUrl('user_profile', {_idOrSlug: slugOrId});
};

Users.hasPassword = function (user) {
  return !!user.services.password;
};

Users.getTwitterName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if(Telescope.utils.checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return null;
};

Users.getGitHubName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if(Telescope.utils.checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(Telescope.utils.checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return null;
};

Users.getTwitterNameById = function (userId) {
  var user = Meteor.users.findOne(userId);
  if (user)
    return Users.getTwitterName(user);
};

Users.getEmail = function (user) {
  if(user.telescope && user.telescope.email){
    return user.telescope.email;
  }else{
    return null;
  }
};

Users.getEmailHash = function (user) {
  // has to be this way to work with Gravatar
  return Gravatar.hash(Users.getEmail(user));
};

Users.getAvatarUrl = function (user) {
  console.warn('FUNCTION getAvatarUrl() IS DEPRECATED -- package bengott:avatar is used instead.');
  return Avatar.getUrl(user);
};

Users.getCurrentUserEmail = function () {
  return Meteor.user() ? Users.getEmail(Meteor.user()) : '';
};

Users.userProfileComplete = function (user) {
  for (var i = 0; i < Telescope.callbacks.profileCompletedChecks.length; i++) {
    if (!Telescope.callbacks.profileCompletedChecks[i](user)) {
      return false;
    }
  }
  return true;
};

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

Users.getUserSetting = function (setting, defaultValue, user) {
  user = user || Meteor.user();
  defaultValue = defaultValue || null;
  var settingValue = this.getProperty(user.telescope, setting);
  return (settingValue === null) ? defaultValue : settingValue;
};

Users.setUserSetting = function (setting, value, userArgument) {
  // note: for some very weird reason, doesn't work when called from Accounts.onCreateUser

  var user;

  if(Meteor.isClient){
    user = Meteor.user(); // on client, default to current user
  }else if (Meteor.isServer){
    user = userArgument; // on server, use argument
  }

  if(!user)
    throw new Meteor.Error(500, 'User not defined');

  console.log('Setting user setting "' + setting + '" to "' + value + '" for ' + Users.getUserName(user));
  var find = {_id: user._id};
  var field = {};
  field['telescope.'+setting] = value;
  var options = {$set: field};
  Meteor.users.update(find, options, {validate: false});
};

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
