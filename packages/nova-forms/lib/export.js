SimpleSchema.extendOptions({
  control: Match.Optional(Match.Any), // NovaForm control (String or React component)
  order: Match.Optional(Number), // order in the form
  group: Match.Optional(Object), // form fieldset group
  insertableIf: Match.Optional(Function),
  editableIf: Match.Optional(Function)
});

import NovaForm from "./NovaForm.jsx";

export default NovaForm;
