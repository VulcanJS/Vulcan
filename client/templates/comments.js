Template.comments.show = function(){
  var post = Session.get('selected_post');
  var comments = Comments.find({ post: post._id });
  return comments.count() > 0;
};

Template.comments.comments = function(){
  var post = Session.get('selected_post');
  var comments = Comments.find({ post: post._id });
  return comments;
};
