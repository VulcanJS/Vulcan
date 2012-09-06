Meteor.methods({
  comment: function(post, parentComment, text){
    var user = Meteor.users.findOne(this.userId());

    var comment = {
        post: post._id
      , body: text
      , user_id: user._id
      , submitted: new Date().getTime()
    };
    if(parentComment)
      comment.parent = parentComment._id;

    Comments.insert(comment);
    Posts.update(post._id, {$inc: {comments: 1}});
    return true;
  }
});
