Template[getTemplate('comment_reply')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  comment_item: function () {
    return getTemplate('comment_item');
  },
  post: function () {
    if(this.comment) // XXX
      return Posts.findOne(this.comment.post);
  }
});