import Users from "meteor/vulcan:users";

// note: leverage weak dependencies on packages
const Posts = Package['vulcan:posts'] ? Package['vulcan:posts'].default : null;
const Categories = Package['vulcan:categories'] ? Package['vulcan:categories'].default : null;

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
      type: Array,
      optional: true,
      hidden: true, // never show this,
    }
  },
  {
    fieldName: 'subscribers.$',
    fieldSchema: {
      type: String,
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

// check if vulcan:posts exists, if yes, add the custom fields to Posts
if (!!Posts) {

  Posts.addField([
    {
      fieldName: 'subscribers',
      fieldSchema: {
        type: Array,
        optional: true,
        hidden: true, // never show this
      }
    },
    {
      fieldName: 'subscribers.$',
      fieldSchema: {
        type: String,
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

}

// check if vulcan:categories exists, if yes, add the custom fields to Categories
if (!!Categories) {

  Categories.addField([
    {
      fieldName: 'subscribers',
      fieldSchema: {
        type: Array,
        optional: true,
        hidden: true, // never show this
      }
    },
    {
      fieldName: 'subscribers.$',
      fieldSchema: {
        type: String,
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

}
