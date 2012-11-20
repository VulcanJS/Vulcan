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
// action:              If the permission check fails, there are 3 possible outcomes: 
//                          1. (undefined or null) fail silently
//                          2. ('replace') fail and replace the page with something else
//                          3. ('redirect') fail and redirect to another page

canView = function(user, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  // console.log('canView', 'user:', user, 'action:', action, getSetting('requireViewInvite'));
  if(Meteor.isClient && !window.settingsLoaded)
    return false;
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
            // throwError("Please sign in or create an account first.");
            action=='replace' ? Router.goto('no_account') : Router.navigate('signin', {trigger : true});
            break;
          case "no_invite":
            // throwError("Sorry, you need to have an invitation to do view the site.");
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
  // console.log('canPost', user, action, getSetting('requirePostInvite'));
  if(Meteor.isClient && !window.settingsLoaded)
    return false;
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
          action=='replace' ? Router.goto('user_signin') : Router.navigate('signin', {trigger : true});
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
canEdit = function(user, item, action){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  var action=(typeof action === 'undefined') ? null : action;
  try{
    if (!user || !item){
      throw "no_rights";
    } else if (isAdmin(user)) {
      return true;
    } else if (user._id!==item.userId) {
      throw "no_rights";
    }else{
      return true;
    }
  }catch(error){
    if(action){
      switch(error){
        case "no_rights":
          throwError("Sorry, you do not have the rights to edit this item.");
          action=='replace' ? Router.goto('no_rights') : Router.navigate('no_rights', {trigger : true});
          break;
      }
    }
    return false;
  }
}