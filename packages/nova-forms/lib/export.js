import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  "react": "^0.14.6",
  "formsy-react": "^0.17.0",
  "formsy-react-components": "^0.6.6",
  "react-bootstrap": "^0.28.3"
  // 'rebass': '^0.2.4',
});

import NewDocument from "./NewDocument.jsx";
import EditDocument from "./EditDocument.jsx";

SimpleSchema.extendOptions({
  insertableIf: Match.Optional(Function),
  editableIf: Match.Optional(Function)
});

export default {NewDocument, EditDocument};
