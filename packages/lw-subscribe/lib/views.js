// import Users from 'meteor/nova:users';
// 
// if (typeof Package['nova:posts'] !== "undefined") {
//   import Posts from "meteor/nova:posts";
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
