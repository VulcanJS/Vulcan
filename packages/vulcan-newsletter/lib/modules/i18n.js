import { addStrings } from 'meteor/vulcan:core';

addStrings('en', {
  'newsletter': 'Newsletter',
  'newsletter.subscribe': 'Subscribe',
  'newsletter.unsubscribe': 'Unsubscribe',
  'newsletter.subscribe_prompt': 'Subscribe to the newsletter',
  'newsletter.email': 'Your email',
  'newsletter.success_message': 'Thanks for subscribing!',
  'newsletter.subscription_updated': 'Newsletter subscription updated.',
  'newsletter.subscription_failed': 'Subscription failed. Are your API keys configured in your settings file?',

  'newsletter.error_invalid_email': 'Sorry, that doesn\'t look like a valid email.',
  'newsletter.error_already_subscribed': 'Sorry, it looks like you\'re already subscribed to the list.',
  'newsletter.error_has_unsubscribed': 'Sorry, it looks like you\'ve previously unsubscribed from the list, and we\'re not able to re-subscribe you automatically.',
  'newsletter.error_subscription_failed': 'Sorry, your subscription failed ({message}).',
});
