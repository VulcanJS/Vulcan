Template.user_upvoted_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      terms: {
        view: 'userUpvotedPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});