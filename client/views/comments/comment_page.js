Template.comment_page.helpers({
  post: function () {
    return Posts.findOne(this.comment.post);
  }
});