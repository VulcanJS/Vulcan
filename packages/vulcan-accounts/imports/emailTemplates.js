import {Accounts} from 'meteor/accounts-base';
import {getSetting} from 'meteor/vulcan:core';

// the emailTemplates are made available by accounts-password, which we don't want to depend on
if (Package['accounts-password']) {
  Accounts.emailTemplates.siteName = getSetting('public.title', '');
  Accounts.emailTemplates.from =
    getSetting('public.title', '') +
    ' <' +
    getSetting('defaultEmail', 'no-reply@example.com') +
    '>';
}
