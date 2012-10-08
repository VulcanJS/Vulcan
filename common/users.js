isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return user && isAdmin(user);
}
isAdmin=function(user){
  if(!user)
    return false;
  return user.isAdmin;
}
getDisplayNameById = function(userId){
  getDisplayName(Meteor.users.findOne(userId));
}
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username
}
getSignupMethod = function(user){
  if(user.services && user.services.twitter){
    return 'twitter';
  }else{
    return 'regular'
  }
}
getEmail = function(user){
  if(getSignupMethod(user)=='twitter'){
    return user.profile.email;
  }else if(user.emails){
    return user.emails[0].address || user.emails[0].email;
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

findLast= function(user, collection){
  return collection.findOne({userId: user._id}, {sort: {submitted: -1}})
}
limitRate= function(user, collection, interval){
  var now = new Date().getTime();
  var timeFromLast=Math.floor((now-findLast(user, collection).submitted)/1000);
  if(timeFromLast<interval){
   throw new Meteor.Error('999','Please wait '+(interval-timeFromLast)+' seconds before posting again');
  }
}
// Permissions



// user:                Defaults to Meteor.user()
// action:              If the permission check fails, there are 3 possible outcomes: 
//                          1. (undefined or null) fail silently
//                          2. ('replace') fail and replace the page with something else
//                          3. ('redirect') fail and redirect to another page

canView = function(user, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  if(getSetting('requireViewInvite')==true){
    try{
      if(!user){
        throw "no_account";
      }else if(isAdmin(user) || user.isInvited){
        return true;
      }else{
        throw "no_invite";
      }
    }catch(error){
      if(action){
        switch(error){
          case "no_account":
            throwError("Please sign in or create an account first.");
            action=='replace' ? Router.goto('signin') : Router.navigate('signin', {trigger : true});
            break;
          case "no_invite":
            throwError("Sorry, you need to have an invitation to do view the site.");
            action=='replace' ? Router.goto('no_invite') : Router.navigate('invite', {trigger : true});
            break;      
        }
      }   
      return false;
    }
  }else{
    return true;
  }
}
canPost = function(user, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  try{
    if(!user){
      throw "no_account";
    }else if(isAdmin(user)){
      return true;
    }else if(getSetting('requirePostInvite')){
      if(user.isInvited){
        return true;
      }else{
        throw "no_invite";
      }
    }else{
      return true;
    }
  }catch(error){
    if(action){
      switch(error){
        case "no_account":
          throwError("Please sign in or create an account first.");
          action=='replace' ? Router.goto('signin') : Router.navigate('signin', {trigger : true});
          break;
        case "no_invite":
          throwError("Sorry, you need to have an invitation to do this.");
          action=='replace' ? Router.goto('no_invite') : Router.navigate('invite', {trigger : true});
          break;      
      }
    }   
    return false;
  }
}
canComment = function(user, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  return canPost(user, action);
}
canUpvote = function(user, collection, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  return canPost(user, action);
}
canDownvote = function(user, collection, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  return canPost(user, action);
}