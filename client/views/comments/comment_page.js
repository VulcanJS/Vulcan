Template[getTemplate('comment_page')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  comment_item: function () {
    return getTemplate('comment_item');
  },
  post: function () {
    return Posts.findOne(this.comment.post);
  }
});