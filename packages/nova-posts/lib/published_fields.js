Posts.publishedFields = {};

/**
 * Specify which fields should be published by the posts.list publication
 * @array Posts.publishedFields.list
 */
Posts.publishedFields.list = Telescope.utils.arrayToFields([
  "_id",
  "postedAt",
  "url",
  "title",
  "slug",
  "htmlBody",
  "viewCount",
  "lastCommentedAt",
  "clickCount",
  "baseScore",
  "score",
  "status",
  "sticky",
  "author",
  "userId"
]);

/**
 * Specify which fields should be published by the posts.single publication
 * @array Posts.publishedFields.single
 */
Posts.publishedFields.single = Telescope.utils.arrayToFields(Posts.simpleSchema().getPublicFields());