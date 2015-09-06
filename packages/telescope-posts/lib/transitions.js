// Posts.addStateTransition("status", [
//   {
//     name: "approve",
//     from: "*",
//     to: Posts.config.STATUS_APPROVED,
//     callback: function (oldPost, newPost) {
//       Telescope.callbacks.runAsync("postApproveAsync", newPost, oldPost);
//     }
//   },
//   {
//     name: "unapprove",
//     from: Posts.config.STATUS_APPROVED,
//     to: "*",
//     callback: function (oldPost, newPost) {
//       Telescope.callbacks.runAsync("postUnapproveAsync", newPost, oldPost);
//     }
//   },
//   {
//     name: "makePending",
//     from: "*",
//     to: Posts.config.STATUS_PENDING,
//     callback: function (oldPost, newPost) {
//       Telescope.callbacks.runAsync("postMakePendingAsync", newPost, oldPost);
//     }
//   },
//   {
//     name: "reject",
//     from: "*",
//     to: Posts.config.STATUS_REJECTED,
//     callback: function (oldPost, newPost) {
//       Telescope.callbacks.runAsync("postRejectAsync", newPost, oldPost);
//     }
//   }
// ]);