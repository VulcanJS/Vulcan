import SimpleSchema from 'simpl-schema';
import { registerComponent } from 'meteor/vulcan:core';

import './components.js';

if (typeof SimpleSchema !== "undefined") {
  SimpleSchema.extendOptions([
    'control', // SmartForm control (String or React component)
    'order', // order in the form
    'group', // form fieldset group
    'hidden',
    'beforeComponent',
    'afterComponent',
    'placeholder',
  ]);
}

export {default as FormWrapper} from '../components/FormWrapper.jsx';