
// Permissions

// user:                Defaults to Meteor.user()
// returnError:         If there's an error, should we return what the problem is?
// 
// return true if all is well, false || an error string if not
canView = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  
  // console.log('canView', 'user:', user, 'returnError:', returnError, getSetting('requireViewInvite'));
  
  if(Meteor.isClient && !Session.get('settingsLoaded'))
    return false;
  
  if(getSetting('requireViewInvite') === true){
    if(!user){
      return returnError ? "no_account" : false;
    }else if(isAdmin(user) || user.isInvited){
      return true;
    }else{
      return returnError ? "no_invite" : false;
    }
  }else{
    return true;
  }
}
canViewById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canView(user, returnError);
}
canPost = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;

  // console.log('canPost', user, action, getSetting('requirePostInvite'));
  if(Meteor.isClient && !Session.get('settingsLoaded'))
    return false;
  
  if(!user){
    return returnError ? "no_account" : false;
  } else if (isAdmin(user)) {
    return true;
  } else if (getSetting('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      return returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
}
canPostById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canPost(user, returnError);
}
canComment = function(user, returnError){
  return canPost(user, returnError);
}
canCommentById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canComment(user, returnError);
}
canUpvote = function(user, collection, returnError){
  return canPost(user, returnError);
}
canUpvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canUpvote(user, returnError);
}
canDownvote = function(user, collection, returnError){
  return canPost(user, returnError);
}
canDownvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canDownvote(user, returnError);
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
canEditById = function(userId, item){
  var user = Meteor.users.findOne(userId);
  return canEdit(user, item);
}
currentUserCanEdit = function(item) {
  return canEdit(Meteor.user(), item);
}
canInvite = function(user){
  return isInvited(user) || isAdmin(user);
}