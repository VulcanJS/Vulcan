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
  // TODO: fix this
  // {
  //   fieldName: 'newsletter_subscribeToNewsletter',
  //   fieldName: 'telescope.newsletter.showBanner',
  //   fieldSchema: {
  //     type: Boolean,
  //     optional: true,
  //     publish: true,
  //     defaultValue: true,
  //   }
  // },
  {
    fieldName: 'newsletter_subscribeToNewsletter',
    fieldSchema: {
      label: 'Subscribe to Newsletter',
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
