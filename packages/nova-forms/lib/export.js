import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  "react": "^0.14.6",
  "formsy-react": "^0.17.0",
  "formsy-react-components": "^0.6.6",
  "react-bootstrap": "^0.28.3"
  // 'rebass': '^0.2.4',
});

SimpleSchema.extendOptions({
  control: Match.Optional(Match.Any), // NovaForm control (String or React component)
  order: Match.Optional(Number) // order in the form
});

// import NewDocument from "./NewDocument.jsx";
// import EditDocument from "./EditDocument.jsx";
import NovaForm from "./NovaForm.jsx";

SimpleSchema.extendOptions({
  insertableIf: Match.Optional(Function),
  editableIf: Match.Optional(Function)
});

export default NovaForm;
