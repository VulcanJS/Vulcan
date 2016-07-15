import NewsletterSubscribe from './components/NewsletterSubscribe.jsx';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

Posts.addField({
  fieldName: 'scheduledAt',
  fieldSchema: {
    type: Date,
    optional: true
  }
});

Users.addField([
  {
    fieldName: 'telescope.newsletter_subscribeToNewsletter',
    fieldSchema: {
      label: 'Subscribe to newsletter',
      type: Boolean,
      optional: true,
      publish: true,
      insertableIf: Users.is.memberOrAdmin,
      editableIf: Users.is.ownerOrAdmin,
      control: NewsletterSubscribe,
      group: {
        name: "newsletter",
        label: "Newsletter",
        order: 3
      }
    }
  },
]);

// Settings

if (typeof Telescope.settings.collection !== "undefined") {
  Telescope.settings.collection.addField([
    {
      fieldName: 'enableNewsletter',
      fieldSchema: {
        type: Boolean,
        optional: true,
        autoform: {
          group: 'newsletter',
          instructions: 'Enable newsletter (requires restart).'
        }
      }
    },
    {
      fieldName: 'enableNewsletterInDev',
      fieldSchema: {
        type: Boolean,
        optional: true,
        autoform: {
          group: 'newsletter',
          instructions: 'Enable newsletter in development too (requires restart).'
        }
      }
    },
    {
      fieldName: "mailChimpAPIKey",
      fieldSchema: {
        type: String,
        optional: true,
        private: true,
        autoform: {
          group: "newsletter",
          class: "private-field"
        }
      }
    },
    {
      fieldName: 'mailChimpListId',
      fieldSchema: {
        type: String,
        optional: true,
        private: true,
        autoform: {
          group: 'newsletter',
          instructions: 'The ID of the list you want to send to.',
          class: "private-field"
        }
      }
    },
    {
      fieldName: 'postsPerNewsletter',
      fieldSchema: {
        type: Number,
        optional: true,
        autoform: {
          group: 'newsletter'
        }
      }
    },
    {
      fieldName: 'newsletterFrequency',
      fieldSchema: {
        type: [Number],
        optional: true,
        defaultValue: [2,4,6],
        autoform: {
          group: 'newsletter',
          instructions: 'Defaults to once a week on Monday. Changes require restarting your app to take effect.',
          noselect: true,
          options: [
            {
              value: 1,
              label: 'Sunday'
            },
            {
              value: 2,
              label: 'Monday'
            },
            {
              value: 3,
              label: 'Tuesday'
            },
            {
              value: 4,
              label: 'Wednesday'
            },
            {
              value: 5,
              label: 'Thursday'
            },
            {
              value: 6,
              label: 'Friday'
            },
            {
              value: 7,
              label: 'Saturday'
            }
          ]
        }
      }
    },
    {
      fieldName: 'newsletterTime',
      fieldSchema: {
        type: String,
        optional: true,
        defaultValue: '00:00',
        autoform: {
          group: 'newsletter',
          instructions: 'Defaults to 00:00/12:00 AM. Time to send out newsletter if enabled (GMT).',
          type: 'time'
        }
      }
    },
    {
      fieldName: 'autoSubscribe',
      fieldSchema: {
        type: Boolean,
        optional: true,
        autoform: {
          group: 'newsletter',
          instructions: 'Automatically subscribe new users on sign-up.'
        }
      }
    }
  ]);
}
