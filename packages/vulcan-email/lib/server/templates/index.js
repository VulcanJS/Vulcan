import { addTemplates } from '../email.js';

addTemplates({
  templateError: Assets.getText('lib/server/templates/template_error.handlebars'),
});
