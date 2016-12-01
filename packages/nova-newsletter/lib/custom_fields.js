import NewsletterSubscribe from './components/NewsletterSubscribe.jsx';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

Posts.addField({
  fieldName: 'scheduledAt',
  fieldSchema: {
    type: Date,
    optional: true,
    viewableIf: ['anonymous'],
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
      insertableIf: ['default'],
      editableIf: ['default'],
      viewableIf: ['anonymous'],
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