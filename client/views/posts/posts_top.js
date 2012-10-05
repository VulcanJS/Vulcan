Template.posts_top.posts = function(){
  var posts = Posts.find({}, {sort: {score: -1}});
  return posts;
};

Template.posts_top.created = function(){
	window.sortBy="score";
}

Template.posts_top.helpers({
	canView: function(){
		return canView(Meteor.user());
	}
});