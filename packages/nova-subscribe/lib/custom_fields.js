import Users from "meteor/nova:users";

Users.addField([
  {
    fieldName: '__subscribedItems',
    fieldSchema: {
      type: Object,
      optional: true,
      blackbox: true,
      hidden: true, // never show this
    }
  },
  {
    fieldName: '__subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      hidden: true, // never show this,
      // publish: true,
      // join: {
      //   joinAs: "subscribersArray",
      //   collection: () => Users
      // }
    }
  },
  {
    fieldName: '__subscriberCount',
    fieldSchema: {
      type: Number,
      optional: true,
      hidden: true, // never show this
    }
  }
]);

// check if nova:posts exists, if yes, add the custom fields to Posts
if (typeof Package['nova:posts'] !== "undefined") {
  import Posts from 'meteor/nova:posts';
  Posts.addField([
    {
      fieldName: 'subscribers',
      fieldSchema: {
        type: [String],
        optional: true,
        hidden: true, // never show this
        // publish: true,
        // join: {
        //   joinAs: "subscribersArray",
        //   collection: () => Users
        // }
      }
    },
    {
      fieldName: 'subscriberCount',
      fieldSchema: {
        type: Number,
        optional: true,
        hidden: true, // never show this
      }
    }
  ]);

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
        hidden: true, // never show this
        // publish: true,
        // join: {
        //   joinAs: "subscribersArray",
        //   collection: () => Users
        // }
      }
    },
    {
      fieldName: 'subscriberCount',
      fieldSchema: {
        type: Number,
        optional: true,
        hidden: true, // never show this
      }
    }
  ]);

}
