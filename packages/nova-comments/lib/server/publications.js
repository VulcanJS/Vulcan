import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Comments from '../collection.js';

Comments._ensureIndex({postId: 1});
Comments._ensureIndex({parentCommentId: 1});

/**
 * @summary Publish a list of comments, along with the posts and users corresponding to these comments
 * @param {Object} terms
 */
Meteor.publish('comments.list', function (terms) {

  const currentUser = this.userId && Users.findOne(this.userId);

  terms.currentUserId = this.userId; // add currentUserId to terms
  const {selector, options} = Comments.parameters.get(terms);

  // commenting this because of FR-SSR issue
  // Counts.publish(this, 'comments.list', Comments.find(selector, options));

  options.fields = Comments.publishedFields.list;

  const comments = Comments.find(selector, options);
  const posts = Posts.find({_id: {$in: _.pluck(comments.fetch(), 'postId')}}, {fields: Posts.publishedFields.list});
  const users = Users.find({_id: {$in: _.pluck(comments.fetch(), 'userId')}}, {fields: Users.publishedFields.list});

  return Users.canDo(currentUser, "comments.view.all") ? [comments, posts, users] : [];

});






// /**
//  * Publish a single comment, along with all relevant users
//  * @param {Object} terms
//  */
// Meteor.publish('comments.single', function(terms) {

//   check(terms, {_id: String});

//

//   let commentIds = [terms._id];
//   const childCommentIds = _.pluck(Comments.find({parentCommentId: terms._id}, {fields: {_id: 1}}).fetch(), '_id');
//   commentIds = commentIds.concat(childCommentIds);

//   return Users.canView(currentUser) ? Comments.find({_id: {$in: commentIds}}, {sort: {score: -1, postedAt: -1}}) : [];

// });




// // Publish the post related to the current comment

// Meteor.publish('commentPost', function(commentId) {

//   check(commentId, String);

//

//   if(Users.canViewById(this.userId)){
//     var comment = Comments.findOne(commentId);
//     return Posts.find({_id: comment && comment.postId});
//   }
//   return [];
// });

// // Publish author of the current comment, and author of the post related to the current comment

// Meteor.publish('commentUsers', function(commentId) {

//   check(commentId, String);

//

//   var userIds = [];

//   if(Users.canViewById(this.userId)){

//     var comment = Comments.findOne(commentId);

//     if (!!comment) {
//       userIds.push(comment.userId);

//       var post = Posts.findOne(comment.postId);
//       if (!!post) {
//         userIds.push(post.userId);
//       }

//       return Users.find({_id: {$in: userIds}}, {fields: Users.pubsub.publicProperties});

//     }

//   }

//   return [];

// });
