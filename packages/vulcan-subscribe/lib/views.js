// import Users from 'meteor/vulcan:users';
//
// if (typeof Package['example-forum'] !== "undefined") {
//   import Posts from "meteor/example-forum";
//
//   Posts.views.add("userSubscribedPosts", function (terms) {
//     var user = Users.findOne(terms.userId),
//         postsIds = [];
//
//     if (user && user.subscribedItems && user.subscribedItems.Posts) {
//       postsIds = _.pluck(user.subscribedItems.Posts, "itemId");
//     }
//
//     return {
//       selector: {_id: {$in: postsIds}},
//       options: {limit: 5, sort: {postedAt: -1}}
//     };
//   });
// }
