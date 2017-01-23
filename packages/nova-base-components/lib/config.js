import { getSetting } from 'meteor/nova:core';
import Users from 'meteor/nova:users';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

Users.avatar.setOptions({
  "gravatarDefault": "mm",
  "defaultImageUrl": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"
});

// https://github.com/softwarerero/meteor-accounts-t9n
T9n.setLanguage(getSetting("locale", "en"));
