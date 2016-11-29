import Telescope from 'meteor/nova:lib';
import NewsletterSubscribe from './components/NewsletterSubscribe.jsx';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

// check if user can create a new account
const canInsert = user => Users.canDo(user, "users.new");
// check if user can edit a user
const canEdit = Users.canEdit;

const alwaysPublic = user => true;

Posts.addField({
  fieldName: 'scheduledAt',
  fieldSchema: {
    type: Date,
    optional: true,
    viewableIf: alwaysPublic,
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
      insertableIf: canInsert,
      editableIf: canEdit,
      viewableIf: alwaysPublic,
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