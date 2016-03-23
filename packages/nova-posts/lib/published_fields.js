import PublicationsUtils from 'meteor/utilities:smart-publications';

Posts.publishedFields = {};

/**
 * Specify which fields should be published by the posts.list publication
 * @array Posts.publishedFields.list
 */
Posts.publishedFields.list = PublicationsUtils.arrayToFields([
  "_id",
  "postedAt",
  "url",
  "title",
  "slug",
  "excerpt",//swapped with htmlBody
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
Posts.publishedFields.single = PublicationsUtils.arrayToFields(Posts.getPublishedFields());
