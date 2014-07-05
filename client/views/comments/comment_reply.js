Template[getTemplate('comment_reply')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  comment_item: function () {
    return getTemplate('comment_item');
  },
  comment_form: function () {
    return getTemplate('comment_form');
  },
  post: function () {
    if(this.comment){ // XXX
      var post = Posts.findOne(this.comment.postId);
      return post;
    }
  }
});