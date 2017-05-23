import Vulcan from 'meteor/vulcan:core';
import Newsletters from './modules/index.js';

import './server/newsletters.js';
import './server/cron.js';
import './server/emails.js';
import './server/mutations.js';
import './server/callbacks.js';

import './server/integrations/sendy.js';
import './server/integrations/mailchimp.js';

Vulcan.Newsletters = Newsletters;

export default Newsletters;