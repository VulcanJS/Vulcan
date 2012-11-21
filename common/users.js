isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return user && isAdmin(user);
}
isAdmin=function(user){
  if(!user || typeof user === 'undefined')
    return false;
  return !!user.isAdmin;
}
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username;
}
getDisplayNameById = function(userId){
  return getDisplayName(Meteor.users.findOne(userId));
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
    return 'https://api.twitter.com/1/users/profile_image?screen_name='+user.services.twitter.screenName;
  }else{
    return Gravatar.getGravatar(user, {
      d: 'http://telesc.pe/img/default_avatar.png',
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
  return collection.findOne({userId: user._id}, {sort: {submitted: -1}});
}
timeSinceLast = function(user, collection){
  var now = new Date().getTime();
  var last = findLast(user, collection);
  if(!last)
    return 999; // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now-last.submitted)/1000));
}
numberOfItemsInPast24Hours = function(user, collection){
  var mDate = moment(new Date());
  var items=collection.find({
    userId: user._id,
    submitted: {
      $gte: mDate.subtract('hours',24).valueOf()
    }
  });
  return items.count();
}

// Permissions

// user:                Defaults to Meteor.user()
// returnError:         If there's an error, should we return what the problem is?
// 
// return true if all is well, false || an error string if not
canView = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  
  // console.log('canView', 'user:', user, 'returnError:', returnError, getSetting('requireViewInvite'));
  
  // XXX: replace with session var
  if(Meteor.isClient && !window.settingsLoaded)
    return false;
  
  if(getSetting('requireViewInvite') === true){
    if(!user){
      return returnError ? "no_account" : false;
    }else if(isAdmin(user) || user.isInvited){
      return true;
    }else{
      throw returnError ? "no_invite" : false;
    }
  }else{
    return true;
  }
}
canPost = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;

  // console.log('canPost', user, action, getSetting('requirePostInvite'));
  if(Meteor.isClient && !window.settingsLoaded)
    return false;
  
  if(!user){
    return returnError ? "no_account" : false;
  } else if (isAdmin(user)) {
    return true;
  } else if (getSetting('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      throw returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
}
canComment = function(user, returnError){
  return canPost(user, returnError);
}
canUpvote = function(user, collection, returnError){
  return canPost(user, returnError);
}
canDownvote = function(user, collection, returnError){
  return canPost(user, returnError);
}
canEdit = function(user, item, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  
  if (!user || !item){
    return returnError ? "no_rights" : false;
  } else if (isAdmin(user)) {
    return true;
  } else if (user._id!==item.userId) {
    return returnError ? "no_rights" : false;
  }else {
    return true;
  }
}