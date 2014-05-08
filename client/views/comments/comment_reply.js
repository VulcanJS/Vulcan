Template.comment_reply.helpers({
  post: function () {
    if(this.comment) // XXX
      return Posts.findOne(this.comment.post);
  }
});