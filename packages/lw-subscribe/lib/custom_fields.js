import Users from "meteor/nova:users";
import Posts from "meteor/nova:posts"
import Comments from "meteor/nova:comments"
import Categories from "meteor/nova:categories"

Users.addField([
  {
    fieldName: 'subscribedItems',
    fieldSchema: {
      type: Object,
      optional: true,
      blackbox: true,
      hidden: true, // never show this
    }
  },
  {
    fieldName: 'subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      hidden: true, // never show this,
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

Posts.addField([
  {
    fieldName: 'subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      hidden: true, // never show this
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

Comments.addField([
  {
    fieldName: 'subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      hidden: true, // never show this
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

Categories.addField([
  {
    fieldName: 'subscribers',
    fieldSchema: {
      type: [String],
      optional: true,
      hidden: true, // never show this
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
