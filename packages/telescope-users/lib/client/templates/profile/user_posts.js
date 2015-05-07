Template.user_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      terms: {
        view: 'userPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});