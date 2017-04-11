import Vulcan from 'meteor/vulcan:core';
import Newsletters from './modules/index.js';

import './server/newsletter.js';
import './server/cron.js';
import './server/emails.js';
import './server/mutations.js';
import './server/callbacks.js';

import './server/sendy/sendy.js';
import './server/mailchimp/mailchimp_newsletter.js';

Vulcan.Newsletters = Newsletters;

export default Newsletters;