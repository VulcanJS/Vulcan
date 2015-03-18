var getPhoto = function(photo){
	return photo;
}

var extendPost = function(post){
	if(post.photo){
		var photo = getPhoto(post.photo);
		if(photo)
			post.photo = photo;
	}
	return post;
}

postSubmitMethodCallbacks.push(extendPost);
