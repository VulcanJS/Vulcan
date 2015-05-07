Template.user_downvoted_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      terms: {
        view: 'userDownvotedPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});