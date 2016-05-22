// import Avatar from 'meteor-avatar-core';
import { Avatar } from 'meteor/nova:core';

// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
// checkNpmVersions({
//   "formsy-react": "^0.18.0",
//   "formsy-react-components": "^0.7.1",
//   // "react-mounter": "^1.1.0",
//   // "react-no-ssr": "^1.0.1",
//   "react-bootstrap": "^0.29.0",
// });

Avatar.setOptions({
  "gravatarDefault": "mm",
  "defaultImageUrl": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"
});