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
    console.log('//--------------------------//\nUpdating user profiles…')
    if(isAdmin(Meteor.user())){
      var allUsers = Meteor.users.find();
      console.log('> Found '+allUsers.count()+' users.\n');

      allUsers.forEach(function(user){
        console.log('> Updating user '+user._id+' ('+user.username+')');

        // update user slug
        if(getUserName(user))
          Meteor.users.update(user._id, {$set:{slug: slugify(getUserName(user))}});

        // update user isAdmin flag
        if(typeof user.isAdmin === 'undefined')
          Meteor.users.update(user._id, {$set: {isAdmin: false}});

        // update postCount
        var postsByUser = Posts.find({userId: user._id});
        Meteor.users.update(user._id, {$set: {postCount: postsByUser.count()}});
        console.log(postsByUser.count())
        // update commentCount
        var commentsByUser = Comments.find({userId: user._id});
        Meteor.users.update(user._id, {$set: {commentCount: commentsByUser.count()}});
                console.log(commentsByUser.count())

      });
    }
    console.log('Done updating user profiles.\n//--------------------------//')
  },
  updatePostsSlugs: function () {
    //TODO
  }
})