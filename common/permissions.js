
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
      return returnError ? "no_invite" : false;
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
      return returnError ? "no_invite" : false;
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