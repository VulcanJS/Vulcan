Comments.publishedFields = {};

/**
 * Specify which fields should be published by the posts.list publication
 * @array Posts.publishedFields.list
 */
Comments.publishedFields.list = Telescope.utils.arrayToFields([
  "_id",
  "parentCommentId",
  "topLevelCommentId",
  "postedAt",
  "htmlBody",
  "author",
  "inactive",
  "postId",
  "userId",
  "isDeleted"
]);

/**
 * Specify which fields should be published by the posts.single publication
 * @array Posts.publishedFields.single
 */
Comments.publishedFields.single = Telescope.utils.arrayToFields(Comments.simpleSchema().getPublicFields());