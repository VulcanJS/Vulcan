Template.user_upvoted_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      options: {
        currentUser: user,
        fieldLabel: i18n.t("upvotedAt"),
        fieldValue: function (post) {
          var user = this.currentUser;
          var vote = _.findWhere(user.telescope.upvotedPosts, {itemId: post._id});
          return moment(vote.votedAt).format("MM/DD/YYYY, HH:mm");
        }
      },
      terms: {
        view: 'userUpvotedPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});