import PublicationsUtils from 'meteor/utilities:smart-publications';

Feeds = new Mongo.Collection('feeds');

Feeds.schema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin
  },
  userId: {
    type: String,
    label: 'feedUser',
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    control: "select",
    publish: true,
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
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
      options: function () {
        var categories = Categories.find().map(function (category) {
          return {
            value: category._id,
            label: category.name
          };
        });
        return categories;
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

// used to keep track of which feed a post was imported from
Posts.addField([
  {
    fieldName: 'feedId',
    fieldSchema: {
      type: String,
      label: 'feedId',
      optional: true,
      autoform: {
        omit: true
      }
    }
  },
// the RSS ID of the post in its original feed
  {
    fieldName: 'feedItemId',
    fieldSchema: {
      type: String,
      label: 'feedItemId',
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
]);
PublicationsUtils.addToFields(Posts.publishedFields.list, ['feedId', 'feedItemId']);

Meteor.startup(() => {
  Meteor.methods({
    'feeds.new'(feedUrl) {
      check(feedUrl, Feeds.schema);

      if (Feeds.findOne({url: feedUrl.url}))
        throw new Meteor.Error('already-exists', __('feed_already_exists'));

      if (!Meteor.user() || !Users.is.admin(Meteor.user()))
        throw new Meteor.Error('login-required', __('you_need_to_login_and_be_an_admin_to_add_a_new_feed'));

      return Feeds.insert(feedUrl);
    },
    'feeds.edit'(feed) {
      // use smart-method
    },
    'feeds.remove'(feedId) {
      //use smart-method
    }
  });
});