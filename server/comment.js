Meteor.methods({
  comment: function(post_id, parentComment_id, text){
    var user = Meteor.users.findOne(this.userId());

    var comment = {
        post: post_id
      , body: text
      , user_id: user._id
      , submitted: new Date().getTime()
    };
    if(parentComment_id)
      comment.parent = parentComment_id;

    var new_comment_id=Comments.insert(comment);
    Posts.update(post_id, {$inc: {comments: 1}});

    Meteor.call('upvoteComment', new_comment_id);

    return new_comment_id;
  }
});
