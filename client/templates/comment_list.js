(function() {

Template.comment_list.has_comments = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  if(post){
    return Comments.find({post: post._id, parent: null}).count() > 0;
  }
};

Template.comment_list.child_comments = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return Comments.find({post: post._id, parent: null}, {sort: {score: -1, submitted: -1}});
};

Template.comment_list.rendered = function(){
	// t("comment_list");
}

})();