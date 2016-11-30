import Telescope from 'meteor/nova:lib';
import Users from './collection.js';
import moment from 'moment';
import _ from 'underscore';

Users.helpers({getCollection: () => Users});
Users.helpers({getCollectionName: () => "users"});

////////////////////
//  User Getters  //
////////////////////

/**
 * @summary Get a user
 * @param {String} userOrUserId
 */
Users.getUser = function (userOrUserId) {
  if (typeof userOrUserId === "undefined") {
    if (!Meteor.user()) {
      throw new Error();
    } else {
      return Meteor.user();
    }
  } else if (typeof userOrUserId === "string") {
    return Users.findOne(userOrUserId);
  } else {
    return userOrUserId;
  }
};

/**
 * @summary Get a user's username (unique, no special characters or spaces)
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
Users.getUserNameById = function (userId) {return Users.getUserName(Users.findOne(userId))};

/**
 * @summary Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getDisplayName = function (user) {
  if (typeof user === "undefined") {
    return "";
  } else {
    return (user.__displayName) ? user.__displayName : Users.getUserName(user);
  }
};
Users.getDisplayNameById = function (userId) {return Users.getDisplayName(Users.findOne(userId));};

/**
 * @summary Get a user's profile URL
 * @param {Object} user (note: we only actually need either the _id or slug properties)
 * @param {Boolean} isAbsolute
 */
Users.getProfileUrl = function (user, isAbsolute) {
  if (typeof user === "undefined") {
    return "";
  }
  isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  if (user.__slug) {
    return `${prefix}/users/${user.__slug}`;
  } else {
    return "";
  }
};

/**
 * @summary Get a user's account edit URL
 * @param {Object} user (note: we only actually need either the _id or slug properties)
 * @param {Boolean} isAbsolute
 */
Users.getEditUrl = function (user, isAbsolute) {
  return `${Users.getProfileUrl(user, isAbsolute)}/edit`;
};

/**
 * @summary Get a user's Twitter name
 * @param {Object} user
 */
Users.getTwitterName = function (user) {
  // return twitter name provided by user, or else the one used for twitter login
  if (typeof user !== "undefined") {
    if (Telescope.utils.checkNested(user, 'profile', 'twitter')) {
      return user.profile.twitter;
    } else if(Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')) {
      return user.services.twitter.screenName;
    }
  }
  return null;
};
Users.getTwitterNameById = function (userId) {return Users.getTwitterName(Users.findOne(userId));};

/**
 * @summary Get a user's GitHub name
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
Users.getGitHubNameById = function (userId) {return Users.getGitHubName(Users.findOne(userId));};

/**
 * @summary Get a user's email
 * @param {Object} user
 */
Users.getEmail = function (user) {
  if(user.__email){
    return user.__email;
  }else{
    return null;
  }
};
Users.getEmailById = function (userId) {return Users.getEmail(Users.findOne(userId));};

/**
 * @summary Get a user's email hash
 * @param {Object} user
 */
Users.getEmailHash = function (user) {
  return user.__emailHash;
};
Users.getEmailHashById = function (userId) {return Users.getEmailHash(Users.findOne(userId));};

/**
 * @summary Get a user setting
 * @param {Object} user
 * @param {String} settingName
 * @param {Object} defaultValue
 */
Users.getSetting = function (user, settingName, defaultValue) {
  user = user || Meteor.user();
  defaultValue = defaultValue || null;
  // all settings should be prefixed by __ to avoid conflict with other meteor packages writing on Meteor.users collection, so add "__" if needed
  settingName = settingName.slice(0,10) === "__" ? settingName : "__" + settingName;
  if (user) {
    const settingValue = Users.getProperty(user, settingName);
    return typeof settingValue === 'undefined' ? defaultValue : settingValue;
  } else {
    return defaultValue;
  }
};

////////////////////
//  User Checks   //
////////////////////

/**
 * @summary Check if the user has completed their profile.
 * @param {Object} user
 */
Users.hasCompletedProfile = function (user) {
  return _.every(Users.getRequiredFields(), function (fieldName) {
    return !!Telescope.getNestedProperty(user, fieldName);
  });
};
Users.hasCompletedProfileById = function (userId) {return Users.hasCompletedProfile(Users.findOne(userId));};

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

Users.getProperty = function (object, property) {
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return undefined
    return (typeof object[parent] === "undefined") ? undefined : this.getProperty(object[parent], array.join('.'));
  }else{
    // else return property
    return object[array[0]];
  }
};

Users.getViewableFields = function (user, collection) {
  return Telescope.utils.arrayToFields(_.compact(_.map(collection.simpleSchema()._schema,
    (field, fieldName) => {
      return Users.canViewField(user, field) ? fieldName : null;
    }
  )));
}

////////////////////
// More Helpers   //
////////////////////

// helpers that don't take a user as argument

/**
 * @summary @method Users.getRequiredFields
 * Get a list of all fields required for a profile to be complete.
 */
Users.getRequiredFields = function () {
  var schema = Telescope.utils.stripTelescopeNamespace(Users.simpleSchema()._schema);
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.required;
  });
  return fields;
};

Users.adminUsers = function (options) {
  return this.find({isAdmin : true}, options).fetch();
};

Users.getCurrentUserEmail = function () {
  return Meteor.user() ? Users.getEmail(Meteor.user()) : '';
};

Users.findByEmail = function (email) {
  return Users.findOne({"__email": email});
};

