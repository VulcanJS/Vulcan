import NewsletterSubscribe from '../components/NewsletterSubscribe.jsx';
import Posts from "meteor/vulcan:posts";
import Users from 'meteor/vulcan:users';

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
    fieldName: 'newsletter_subscribeToNewsletter',
    fieldSchema: {
      label: 'Subscribe to Newsletter',
      type: Boolean,
      optional: true,
      defaultValue: false,
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['guests'],
      control: NewsletterSubscribe,
      group: {
        name: "newsletter",
        label: "Newsletter",
        order: 3
      }
    }
  },
]);
