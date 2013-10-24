Meteor.methods({
	updateCategories: function () {
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
  updateUserSlugs: function () {
  	if(isAdmin(Meteor.user())){
	  	Meteor.users.find().forEach(function(user){
	  		Meteor.users.update(user._id, {$set:{'profile.slug': slugify(getDisplayName(user))}});
	  	});
	  }	
  }
})