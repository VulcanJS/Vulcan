import { addStrings } from 'meteor/vulcan:core';

addStrings('en', {
  'newsletter.error_invalid_email': `Sorry, that doesn't look like a valid email.`,
  'newsletter.error_already_subscribed': `Sorry, it looks like you're already subscribed to the list.`,
  'newsletter.error_has_unsubscribed': `Sorry, it looks like you've previously unsubscribed from the list, and we're not able to re-subscribe you automatically.`,
  'newsletter.error_subscription_failed': `Sorry, your subscription failed ({message}).`,
});