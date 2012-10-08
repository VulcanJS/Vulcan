Template.posts_top.posts = function(){
  var posts = Posts.find();
  return posts;
};

Template.posts_top.created = function(){
	window.sortBy="score";
}

Template.posts_top.events({
	'click button.more': function() {
		Session.set('current_page', Session.get("current_page") + 1);
	}
});

