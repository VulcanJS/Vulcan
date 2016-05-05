Feeds = new Mongo.Collection('feeds');

Feeds.schema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    publish: true,
  },
  title: {
    type: String,
    optional: true,
    publish: true,
  },
  userId: {
    type: String,
    label: 'Feed User',
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    control: "select",
    publish: true,
    autoform: {
      group: 'admin',
      prefill: () => Meteor.userId(),
      options: () => {
        // only find admins and owners, even if the feeds modal is opened on a normal user profile page
        return Meteor.users.find({$or: [{isAdmin: true}, {isOwner: true}]}).map((user) => {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    },
    join: {
      joinAs: "user",
      collection: () => Meteor.users
    }
  },
  categories: {
    type: [String],
    control: "checkboxgroup",
    optional: true,
    insertableIf: Users.is.memberOrAdmin,
    editableIf: Users.is.ownerOrAdmin,
    autoform: {
      noselect: true,
      type: "bootstrap-category",
      order: 50,
      options: () => {
        return Categories.find().map((category) => {
          return {
            value: category._id,
            label: category.name
          };
        });
      }
    },
    publish: true,
    join: {
      joinAs: "categoriesArray",
      collection: () => Categories
    }
  }
});

Feeds.attachSchema(Feeds.schema);