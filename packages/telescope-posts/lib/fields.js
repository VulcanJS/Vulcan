Posts.publicationFields = {};

/**
 * Specify which fields should be published by the posts.list publication
 * @array Posts.publicationFields.list
 */
Posts.publicationFields.list = [
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
];

/**
 * Specify which fields should be published by the posts.single publication
 * @array Posts.publicationFields.single
 */
Posts.publicationFields.single = Posts.simpleSchema().getPublicFields();