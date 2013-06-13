isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return user && isAdmin(user);
}
isAdmin=function(user){
  if(!user || typeof user === 'undefined')
    return false;
  return !!user.isAdmin;
}
adminUsers = function(){
  return Meteor.users.find({isAdmin : true}).fetch();
}
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username;
}
getDisplayNameById = function(userId){
  return getDisplayName(Meteor.users.findOne(userId));
}
getTwitterName = function(user){
  try {
    return user.services.twitter.screenName;
  } catch(e) {
    return undefined;
  }
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
  if(getSignupMethod(user)=='twitter'){
    return user.profile.email;
  }else if(user.emails){
    return user.emails[0].address || user.emails[0].email;
  }else if(user.profile && user.profile.email){
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