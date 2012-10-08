Template.posts_new.posts = function(){
  var posts = Posts.find();
  return posts;
};

Template.posts_new.created = function(){
	window.sortBy="time";
}

Template.posts_new.events({
	'click button.more': function() {
		Session.set('current_page', Session.get("current_page") + 1);
	}
});
