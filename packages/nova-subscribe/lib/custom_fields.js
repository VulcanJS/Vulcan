import PublicationUtils from 'meteor/utilities:smart-publications';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Categories from "meteor/nova:categories";

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

PublicationUtils.addToFields(Users.publishedFields.list, ["telescope.subscribedItems", "telescope.subscribers", "telescope.subscriberCount"]);
PublicationUtils.addToFields(Posts.publishedFields.list, ["subscribers", "subscriberCount"]);
PublicationUtils.addToFields(Categories.publishedFields.list, ["subscribers", "subscriberCount"]);
