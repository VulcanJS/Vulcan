// import Telescope from 'meteor/nova:lib';
// import Posts from './collection.js'
// import marked from 'marked';
// import Users from 'meteor/nova:users';

// //////////////////////////////////////////////////////
// // Collection Hooks                                 //
// //////////////////////////////////////////////////////

// /**
//  * @summary Generate HTML body and excerpt from Markdown on post insert
//  */
// Posts.before.insert(function (userId, doc) {
//   if(!!doc.body) {
//     const htmlBody = Utils.sanitize(marked(doc.body));
//     doc.htmlBody = htmlBody;
//     doc.excerpt = Utils.trimHTML(htmlBody,30);
//   }
// });

// /**
//  * @summary Generate HTML body and excerpt from Markdown when post body is updated
//  */
// Posts.before.update(function (userId, doc, fieldNames, modifier) {
//   // if body is being modified or $unset, update htmlBody too
//   if (Meteor.isServer && modifier.$set && modifier.$set.body) {
//     const htmlBody = Utils.sanitize(marked(modifier.$set.body));
//     modifier.$set.htmlBody = htmlBody;
//     modifier.$set.excerpt = Utils.trimHTML(htmlBody,30);
//   }
//   if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {
//     modifier.$unset.htmlBody = "";
//     modifier.$unset.excerpt = "";
//   }
// });

// /**
//  * @summary Generate slug when post title is updated
//  */
// Posts.before.update(function (userId, doc, fieldNames, modifier) {
//   // if title is being modified, update slug too
//   if (Meteor.isServer && modifier.$set && modifier.$set.title) {
//     modifier.$set.slug = Utils.slugify(modifier.$set.title);
//   }
// });
