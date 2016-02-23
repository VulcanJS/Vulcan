Template.user_subscribed_posts.helpers({
  arguments: function () {
    var user = this;
    return {
      template: "posts_list_compact",
      options: {
        currentUser: user,
        fieldLabel: i18n.t("subscribedAt"),
        fieldValue: function (post) {
          var user = this.currentUser;
          var item = _.findWhere(user.telescope.subscribedItems.Posts, {itemId: post._id});
          return moment(item.subscribedAt).format("MM/DD/YYYY, HH:mm");
        }
      },
      terms: {
        view: 'userSubscribedPosts',
        userId: user._id,
        limit: 5
      }
    }
  }
});