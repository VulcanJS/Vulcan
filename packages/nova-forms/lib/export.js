if (typeof SimpleSchema !== "undefined") {
  SimpleSchema.extendOptions({
    control: Match.Optional(Match.Any), // NovaForm control (String or React component)
    order: Match.Optional(Number), // order in the form
    group: Match.Optional(Object), // form fieldset group
    insertableIf: Match.Optional(Function),
    editableIf: Match.Optional(Function),
    beforeComponent: Match.Optional(Match.Any),
    afterComponent: Match.Optional(Match.Any)
  });
}

import FormWrapper from './FormWrapper.jsx'
export default FormWrapper;
