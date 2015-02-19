var getPhoto = function(post){
	return post.photo;
}

var extendPost = function(post){
	if(post.photo){
		var photo = getPhoto(post.photo);
		if(photo)
			post.photo = photo;
	}
	return post;
}

postSubmitServerCallbacks.push(extendPost);