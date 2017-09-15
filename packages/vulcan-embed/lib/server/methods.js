// import { getSetting } from 'meteor/vulcan:core';
// import Posts from 'meteor/vulcan:posts';

// Meteor.methods({
//   testgetEmbedData: function (url) {
//     check(url, String);
//     console.log(getEmbedData(url));
//   },
//   getEmbedData: function (url) {
//     check(url, String);
//     return getEmbedData(url);
//   },
//   embedlyKeyExists: function () {
//     return !!getSetting('embedlyKey');
//   },
//   generateThumbnail: function (post) {
//     check(post, Posts.simpleSchema());
//     if (Posts.options.mutations.edit.check(Meteor.user(), post)) {
//       regenerateThumbnail(post);
//     }
//   },
//   generateThumbnails: function (limit = 20, mode = "generate") {
//     // mode = "generate" : generate thumbnails only for all posts that don't have one
//     // mode = "all" : regenerate thumbnais for all posts
      
//     if (Users.isAdmin(Meteor.user())) {
      
//       console.log("// Generating thumbnails…")
      
//       const selector = {url: {$exists: true}};
//       if (mode === "generate") {
//         selector.thumbnailUrl = {$exists: false};
//       }

//       const posts = Posts.find(selector, {limit: limit, sort: {postedAt: -1}});

//       posts.forEach((post, index) => {
//         Meteor.setTimeout(function () {
//           console.log(`// ${index}. fetching thumbnail for “${post.title}” (_id: ${post._id})`);
//           try {
//             regenerateThumbnail(post);
//           } catch (error) {
//             console.log(error);
//           }
//         }, index * 1000);
//       });
//     }
//   }
// });