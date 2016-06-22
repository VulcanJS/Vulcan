import Users from './namespace.js';

Users.getNotificationProperties = function (user) {
  const properties = {
    profileUrl: Users.getProfileUrl(user),
    username: Users.getUserName(user),
    siteTitle: Telescope.settings.get('title'),
    siteUrl: Telescope.utils.getSiteUrl()
  };
  return properties;
};