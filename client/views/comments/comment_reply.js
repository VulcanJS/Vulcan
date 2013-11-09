Template.comment_reply.helpers({
  post: function () {
    return Posts.findOne(this.comment.post);
  }
});