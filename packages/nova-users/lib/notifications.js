import Users from './collection.js';
import { Utils, getSetting } from 'meteor/nova:lib';

Users.getNotificationProperties = function (user) {
  const properties = {
    profileUrl: Users.getProfileUrl(user),
    displayName: Users.getDisplayName(user),
    siteTitle: getSetting('title'),
    siteUrl: Utils.getSiteUrl()
  };
  return properties;
};