Template.posts_new.posts = function(){
  var posts = Posts.find({}, {sort: {submitted: -1}});
  return posts;
};

Template.posts_new.created = function(){
	window.sortBy="time";
}