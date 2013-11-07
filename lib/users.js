isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return !!(user && isAdmin(user));
}
isAdmin=function(user){
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return !!user && !!user.isAdmin;
}
isInvited=function(user){
  if(!user || typeof user === 'undefined')
    return false;
  return isAdmin(user) || !!user.isInvited;
}
adminUsers = function(){
  return Meteor.users.find({isAdmin : true}).fetch();
}
getUserName = function(user){
  return user.username || getProperty(user, 'services.twitter.screenName');
}
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username;
}
getDisplayNameById = function(userId){
  return getDisplayName(Meteor.users.findOne(userId));
}
getProfileUrl = function(user) {
  return '/users/' + slugify(getUserName(user));
}
getTwitterName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return false;
}
getGitHubName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return false;
}
getTwitterNameById = function(userId){
  return getTwitterName(Meteor.users.findOne(userId));
}
getSignupMethod = function(user){
  if(user.services && user.services.twitter){
    return 'twitter';
  }else{
    return 'regular';
  }
}
getEmail = function(user){
  if(user.profile && user.profile.email){
    return user.profile.email;
  }else{ 
    return ''; 
  }
}
getAvatarUrl = function(user){
  if(getSignupMethod(user)=='twitter'){
    return 'http://twitter.com/api/users/profile_image/'+user.services.twitter.screenName;
  }else{
    return Gravatar.getGravatar(user, {
      d: 'http://demo.telesc.pe/img/default_avatar.png',
      s: 30
    });
  }
}
getCurrentUserEmail = function(){
  return Meteor.user() ? getEmail(Meteor.user()) : '';
}
userProfileComplete = function(user) {
  return !!getEmail(user);
}

findLast = function(user, collection){
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});
}
timeSinceLast = function(user, collection){
  var now = new Date().getTime();
  var last = findLast(user, collection);
  if(!last)
    return 999; // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now-last.createdAt)/1000));
}
numberOfItemsInPast24Hours = function(user, collection){
  var mDate = moment(new Date());
  var items=collection.find({
    userId: user._id,
    createdAt: {
      $gte: mDate.subtract('hours',24).valueOf()
    }
  });
  return items.count();
}
getUserSetting = function(setting, defaultValue, user){
  var user = (typeof user == 'undefined') ? Meteor.user() : user;
  var defaultValue = (typeof defaultValue == "undefined") ? null: defaultValue;
  var settingValue = getProperty(user.profile, setting);
  return (settingValue == null) ? defaultValue : settingValue;
}
getProperty = function(object, property){
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] == "undefined") ? null : getProperty(object[parent], array.join('.'))
  }else{
    // else return property
    return object[array[0]];
  }
}