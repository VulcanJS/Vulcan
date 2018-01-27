import { addGraphQLMutation, addGraphQLResolvers, getSetting, registerSetting } from 'meteor/vulcan:core';
import { Embed } from '../modules/embed.js';

registerSetting('embedProvider', 'builtin', 'Media embed/metadata provider service');

const embedProvider = getSetting('embedProvider');

addGraphQLMutation('getEmbedData(url: String) : JSON');

const resolver = {
  Mutation: {
    getEmbedData(root, args, context) {
      const data = Embed[embedProvider].getData(args.url);
      // eslint-disable-next-line no-console
      console.log('// getEmbedData');
      // eslint-disable-next-line no-console
      console.log(args);
      // eslint-disable-next-line no-console
      console.log(data);
      return data;
    },
  },
};
addGraphQLResolvers(resolver);

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
//     if (Users.canEdit(Meteor.user(), post)) {
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
