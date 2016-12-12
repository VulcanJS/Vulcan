import Telescope from 'meteor/nova:lib';
import Users from './collection.js';
import { Utils } from 'meteor/nova:lib';

Users.getNotificationProperties = function (user) {
  const properties = {
    profileUrl: Users.getProfileUrl(user),
    displayName: Users.getDisplayName(user),
    siteTitle: Telescope.settings.get('title'),
    siteUrl: Utils.getSiteUrl()
  };
  return properties;
};