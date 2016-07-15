import Users from './collection.js';
import PublicationsUtils from 'meteor/utilities:smart-publications';

Users.publishedFields = {};

/**
 * @summary Specify which fields should be public
 * @type {Array}
 */
Users.publishedFields.public = PublicationsUtils.arrayToFields([
  ...Users.getPublishedFields(),
  'services.twitter.profile_image_url',
  'services.twitter.profile_image_url_https',
  'services.facebook.id',
  'services.twitter.screenName',
  'telescope.downvotedComments',
  'telescope.downvotedPosts',
  'telescope.upvotedComments',
  'telescope.upvotedPosts'
]);

/**
 * @summary Minimum required properties to display avatars and display names
 * @type {Array}
 */
// Users.publishedFields.list = PublicationsUtils.arrayToFields([
//   '_id',
//   'telescope.emailHash',
//   'telescope.slug',
//   'telescope.displayName',
//   'username',
//   'profile.username',
//   'profile.github',
//   'profile.twitter',
//   'services.twitter.profile_image_url',
//   'services.twitter.profile_image_url_https',
//   'services.facebook.id',
//   'services.twitter.screenName',
//   'services.github.screenName', // Github is not really used, but there are some mentions to it in the code
// ]);

// note: to work around nested fields subscription bug, we'll publish
// all public user properties at all times for now
// see https://github.com/meteor/meteor/issues/998

Users.publishedFields.list = Users.publishedFields.public;