import NewsletterSubscribe from './components/NewsletterSubscribe.jsx';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

Posts.addField({
  fieldName: 'scheduledAt',
  fieldSchema: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
  }
});

Users.addField([
  {
    fieldName: '__newsletter_subscribeToNewsletter',
    fieldSchema: {
      label: 'Subscribe to newsletter',
      type: Boolean,
      optional: true,
      publish: true,
      defaultValue: false,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      control: NewsletterSubscribe,
      preload: true,
      group: {
        name: "newsletter",
        label: "Newsletter",
        order: 3
      }
    }
  },
]);