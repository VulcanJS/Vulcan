Meteor.methods({
  updateCategories: function () {
    // TODO: see if this method is still necessary
    if(isAdmin(Meteor.user())){
      Posts.find().forEach(function(post){
        if(post.categories){
          console.log('Found categories for post "'+post.headline+'"');
          Posts.update(post._id,{$set:{userId:post.user_id}}, function(error){
            console.log(error);
          });
        }
      });
    }
  },
  giveInvites: function () {
    if(isAdmin(Meteor.user()))
      Meteor.users.update({}, {$inc:{invitesCount: 1}}, {multi:true});
  },
  updateUserProfiles: function () {
    if(isAdmin(Meteor.user())){
      Meteor.users.find().forEach(function(user){
        // update user slug
        if(getUserName(user))
          Meteor.users.update(user._id, {$set:{slug: slugify(getUserName(user))}});

        // update user isAdmin flag
        if(typeof user.isAdmin === 'undefined')
          Meteor.users.update(user._id, {$set: {isAdmin: false}});
      });
    } 
  },
  updatePostsSlugs: function () {
    //TODO
  }
})