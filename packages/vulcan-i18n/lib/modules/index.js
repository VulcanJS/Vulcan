import { registerSetting } from 'meteor/vulcan:lib';

registerSetting('locale', 'en-US', 'Your app\'s locale (“en”, “fr”, etc.)');

export { default as FormattedMessage } from './message.js';
export { intlShape } from './shape.js';
export { default as IntlProvider } from './provider.js';
export { default as IntlContext } from './context.js';
export { default as useIntl } from './useIntl.js';
