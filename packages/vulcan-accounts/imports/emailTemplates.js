import { Accounts } from 'meteor/accounts-base';
import { getSetting } from 'meteor/vulcan:core';

Accounts.emailTemplates.siteName = getSetting('public.title', '');
Accounts.emailTemplates.from = getSetting('public.title', '')+ ' <' + getSetting('defaultEmail', 'no-reply@example.com') +'>';
