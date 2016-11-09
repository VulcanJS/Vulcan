if (typeof Package['nova:posts'] !== "undefined") {
  import Posts from "meteor/nova:posts";

  Posts.views.add("userSubscribedPosts", function (terms) {
    var user = Users.findOne(terms.userId),
        postsIds = [];

    if (user && user.nova_subscribedItems && user.nova_subscribedItems.Posts) {
      postsIds = _.pluck(user.nova_subscribedItems.Posts, "itemId");
    }

    return {
      selector: {_id: {$in: postsIds}},
      options: {limit: 5, sort: {postedAt: -1}}
    };
  });
}
