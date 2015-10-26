Template.comment_reply.helpers({
  post: function () {
    if(this.comment){
      var post = Posts.findOne(this.comment.postId);
      return post;
    }
  }
});
