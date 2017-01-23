import { getEmbedlyData, addMediaAfterSubmit, updateMediaOnEdit, regenerateThumbnail } from './get_embedly_data.js';
import { GraphQLSchema, getSetting } from 'meteor/nova:core';

// note: not used since the type of the query below is JSON
// const embedlyDataSchema = `
//   type EmbedlyData {
//     title: String
//     media: JSON
//     description: String
//     thumbnailUrl: String
//     sourceName: String
//     sourceUrl: String
//   }
// `;
// GraphQLSchema.addSchema(embedlyDataSchema);

GraphQLSchema.addMutation('getEmbedlyData(url: String) : JSON');

const resolver = {
  Mutation: {
    getEmbedlyData(root, args, context) {
      console.log('// getEmbedlyData')
      console.log(args)
      console.log(getEmbedlyData(args.url))
      return getEmbedlyData(args.url);
    },
  },
};
GraphQLSchema.addResolvers(resolver);

// Meteor.methods({
//   testGetEmbedlyData: function (url) {
//     check(url, String);
//     console.log(getEmbedlyData(url));
//   },
//   getEmbedlyData: function (url) {
//     check(url, String);
//     return getEmbedlyData(url);
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
