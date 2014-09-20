can = {};

// Permissions

// user:                Defaults to Meteor.user()
// returnError:         If there's an error, should we return what the problem is?
// 
// return true if all is well, false || an error string if not
can.view = function(user){
  // console.log('canView', 'user:', user, 'returnError:', returnError, getSetting('requireViewInvite'));

  if(getSetting('requireViewInvite', false)){

    if(Meteor.isClient){
      // on client only, default to the current user
      var user=(typeof user === 'undefined') ? Meteor.user() : user;
    }

    if(user && (isAdmin(user) || isInvited(user))){
      // if logged in AND either admin or invited
      return true;
    }else{
      return false;
    }

  }
  return true;
};
can.viewById = function(userId, returnError){
  // if an invite is required to view, run permission check, else return true
  if(getSetting('requireViewInvite', false)){
    // if user is logged in, then run canView, else return false
    return userId ? canView(Meteor.users.findOne(userId), returnError) : false;
  }
  return true;
};
can.post = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;

  // console.log('canPost', user, action, getSetting('requirePostInvite'));
  
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
};
can.postById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canPost(user, returnError);
};
can.comment = function(user, returnError){
  return canPost(user, returnError);
};
can.commentById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canComment(user, returnError);
};
can.upvote = function(user, collection, returnError){
  return canPost(user, returnError);
};
can.upvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canUpvote(user, returnError);
};
can.downvote = function(user, collection, returnError){
  return canPost(user, returnError);
};
can.downvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return canDownvote(user, returnError);
};
can.edit = function(user, item, returnError){
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
};
can.editById = function(userId, item){
  var user = Meteor.users.findOne(userId);
  return canEdit(user, item);
};
can.currentUserEdit = function(item) {
  return canEdit(Meteor.user(), item);
};
can.invite = function(user){
  return isInvited(user) || isAdmin(user);
};