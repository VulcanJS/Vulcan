Template.user_downvoted_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      options: {
        currentUser: user,
        fieldLabel: i18n.t("downvotedAt"),
        fieldValue: function (post) {
          var user = this.currentUser;
          var vote = _.findWhere(user.telescope.downvotedPosts, {itemId: post._id});
          return moment(vote.votedAt).format("MM/DD/YYYY, HH:mm");
        }
      },
      terms: {
        view: 'userDownvotedPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});