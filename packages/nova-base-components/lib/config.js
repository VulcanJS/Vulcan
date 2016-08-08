import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
// checkNpmVersions({
//   "formsy-react": "^0.18.0",
//   "formsy-react-components": "^0.7.1",
//   // "react-mounter": "^1.1.0",
//   // "react-no-ssr": "^1.0.1",
//   "react-bootstrap": "^0.29.0",
// });

Users.avatar.setOptions({
  "gravatarDefault": "mm",
  "defaultImageUrl": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"
});

// https://github.com/softwarerero/meteor-accounts-t9n
T9n.setLanguage(Telescope.settings.get("locale", "en"));