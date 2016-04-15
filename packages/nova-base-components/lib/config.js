import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  "react": "^0.14.6",
  "formsy-react": "^0.17.0",
  "formsy-react-components": "^0.6.6",
  // "react-mounter": "^1.1.0",
  // "react-no-ssr": "^1.0.1",
  "react-bootstrap": "^0.28.3",
});

Avatar.setOptions({
  "gravatarDefault": "mm",
  "defaultImageUrl": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"
});