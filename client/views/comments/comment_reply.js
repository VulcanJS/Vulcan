Template.comment_reply.post = function(){
  var comment = this;
  return comment && Posts.findOne(comment.post);
};