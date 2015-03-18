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

postSubmitMethodCallbacks.push(extendPost);

var addPhotoAfterSubmit = function (post) {
  var set = {};
  if(post.photo){
    var data = getPhoto(post.photo);
    if (!!data) {
      // only add a thumbnailUrl if there isn't one already
      if (!post.photo) {
        post.photo = data.photo;
        set.photo = data.photo;
      }
      // add media if necessary
      if (!!data.media.html) {
        post.media = data.media;
        set.photo = data.photo;
      }
    }
  }
  Posts.update(post._id, {$set: set});
  return post;
}
postAfterSubmitMethodCallbacks.push(addPhotoAfterSubmit);

// TODO: find a way to only do this is URL has actually changed?
var updatePhotoOnEdit = function (updateObject) {
  var post = updateObject.$set
  if(post.photo){
    var data = getPhoto(post.photo);
    if(!!data && !!data.media.html)
      updateObject.$set.media = data.media
  }
  return updateObject;
}
postEditMethodCallbacks.push(updatePhotoOnEdit);