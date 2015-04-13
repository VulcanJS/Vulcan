Template.comment_reply.helpers({
  post: function () {
    if(this.comment){ // XXX
      var post = Posts.findOne(this.comment.postId);
      return post;
    }
  }
});
