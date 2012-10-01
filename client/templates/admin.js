Template.admin.events= {
	'click .copy-comments-user-id':function(){
	var comments=Comments.find().fetch();
	$.each(comments, function(index, element){

		if(!element.userId){
			Comments.update(element._id,{$set:{userId:element.user_id}}, function(error){
				console.log(error);
			});
		}
		console.log(element);

	});
	},

	'click .copy-posts-user-id':function(){
	var posts=Posts.find().fetch();
	$.each(posts, function(index, element){

		if(!element.userId){
			Posts.update(element._id,{$set:{userId:element.user_id}}, function(error){
				console.log(error);
			});
		}
		console.log(element);

	});
	}
}