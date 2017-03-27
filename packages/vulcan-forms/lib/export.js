import SimpleSchema from 'simpl-schema';
import { registerComponent } from 'meteor/vulcan:core';

if (typeof SimpleSchema !== "undefined") {
  SimpleSchema.extendOptions([
    'control', // SmartForm control (String or React component)
    'order', // order in the form
    'group', // form fieldset group
    'beforeComponent',
    'afterComponent',
    'placeholder',
  ]);
}

import FormWrapper from './FormWrapper.jsx';
export default FormWrapper;
