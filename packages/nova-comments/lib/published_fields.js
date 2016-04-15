import PublicationsUtils from 'meteor/utilities:smart-publications';

Comments.publishedFields = {};

/**
 * @summary Specify which fields should be published by the posts.list publication
 * @array Posts.publishedFields.list
 */
Comments.publishedFields.list = PublicationsUtils.arrayToFields([
  "_id",
  "parentCommentId",
  "topLevelCommentId",
  "postedAt",
  "body",
  "htmlBody",
  "author",
  "inactive",
  "postId",
  "userId",
  "isDeleted"
]);

/**
 * @summary Specify which fields should be published by the posts.single publication
 * @array Posts.publishedFields.single
 */
Comments.publishedFields.single = PublicationsUtils.arrayToFields(Comments.getPublishedFields());