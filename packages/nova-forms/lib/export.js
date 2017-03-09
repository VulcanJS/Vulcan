import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { registerComponent } from 'meteor/nova:core';

if (typeof SimpleSchema !== "undefined") {
  SimpleSchema.extendOptions({
    control: Match.Optional(Match.Any), // SmartForm control (String or React component)
    order: Match.Optional(Number), // order in the form
    group: Match.Optional(Object), // form fieldset group
    beforeComponent: Match.Optional(Match.Any),
    afterComponent: Match.Optional(Match.Any)
  });
}

import FormWrapper from './FormWrapper.jsx';
export default FormWrapper;
