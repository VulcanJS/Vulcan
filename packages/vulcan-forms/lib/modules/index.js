import { registerComponent, registerSetting } from 'meteor/vulcan:core';

registerSetting('forms.warnUnsavedChanges', false, 'Warn user about unsaved changes before leaving route', true);

import './components.js';

export * from './utils';
export { default as FormWrapper } from '../components/FormWrapper.jsx';
