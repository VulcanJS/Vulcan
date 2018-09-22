import { registerComponent, registerSetting } from 'meteor/vulcan:core';

registerSetting('forms.warnUnsavedChanges', false, 'Warn user about unsaved changes before leaving route', true);
registerSetting('forms.components.FormGroup', 'FormGroup', 'The default component to use for form groups', true);
registerSetting('forms.components.FormSubmit', 'FormSubmit', 'The default component to use for the form submit area', true);
registerSetting('forms.components.FormErrors', 'FormErrors', 'The default component to use for the form errors area', true);

import './components.js';

export * from './utils';
export { default as FormWrapper } from '../components/FormWrapper.jsx';
