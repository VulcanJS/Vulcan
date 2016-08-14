import PublicationUtils from 'meteor/utilities:smart-publications';
import Users from "meteor/nova:users";

Users.addField([
  {
    fieldName: 'telescope.subscribedItems',
    fieldSchema: {
      type: Object,
      optional: true,
      blackbox: true,
      autoform: {
        omit: true
      }
    }
  },
  {
    fieldName: 'telescope.subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      autoform: {
        omit: true
      },
      publish: true,
      join: {
        joinAs: "subscribersArray",
        collection: () => Users
      }
    }
  },
  {
    fieldName: 'telescope.subscriberCount',
    fieldSchema: {
      type: Number,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
]);
PublicationUtils.addToFields(Users.publishedFields.list, ["telescope.subscribedItems", "telescope.subscribers", "telescope.subscriberCount"]);

// check if nova:posts exists, if yes, add the custom fields to Posts
if (typeof Package['nova:posts'] !== "undefined") {
  import Posts from 'meteor/nova:posts';
  Posts.addField([
    {
      fieldName: 'subscribers',
      fieldSchema: {
        type: [String],
        optional: true,
        autoform: {
          omit: true
        },
        publish: true,
        join: {
          joinAs: "subscribersArray",
          collection: () => Users
        }
      }
    },
    {
      fieldName: 'subscriberCount',
      fieldSchema: {
        type: Number,
        optional: true,
        autoform: {
          omit: true
        }
      }
    }
  ]);

  PublicationUtils.addToFields(Posts.publishedFields.list, ["subscribers", "subscriberCount"]);
}

// check if nova:categories exists, if yes, add the custom fields to Categories
if (typeof Package['nova:categories'] !== "undefined") {
  import Categories from 'meteor/nova:categories';
  Categories.addField([
    {
      fieldName: 'subscribers',
      fieldSchema: {
        type: [String],
        optional: true,
        autoform: {
          omit: true
        },
        publish: true,
        join: {
          joinAs: "subscribersArray",
          collection: () => Users
        }
      }
    },
    {
      fieldName: 'subscriberCount',
      fieldSchema: {
        type: Number,
        optional: true,
        autoform: {
          omit: true
        }
      }
    }
  ]);

  PublicationUtils.addToFields(Categories.publishedFields.list, ["subscribers", "subscriberCount"]);
}
