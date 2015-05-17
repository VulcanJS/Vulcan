Feeds = new Mongo.Collection('feeds');

Feeds.schema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    editableBy: ["admin"]
  },
  userId: {
    type: String,
    label: 'feedUser',
    editableBy: ["admin"],
    autoform: {
      instructions: 'Posts will be assigned to this user.',
      options: function () {
        var users = Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
        return users;
      }
    }
  },
  categories: {
    type: [String],
    label: 'categories',
    optional: true,
    editableBy: ["admin"],
    autoform: {
      instructions: 'Posts will be assigned to this category.',
      noselect: true,
      editable: true,
      options: function () {
        var categories = Categories.find().map(function (category) {
          return {
            value: category._id,
            label: category.name
          };
        });
        return categories;
      }
    }
  }
});


Feeds.schema.internationalize();

Feeds.attachSchema(Feeds.schema);

// used to keep track of which feed a post was imported from
var feedIdProperty = {
  fieldName: 'feedId',
  fieldSchema: {
    type: String,
    label: 'feedId',
    optional: true,
    autoform: {
      omit: true
    }
  }
};
Posts.addField(feedIdProperty);

// the RSS ID of the post in its original feed
var feedItemIdProperty = {
  fieldName: 'feedItemId',
  fieldSchema: {
    type: String,
    label: 'feedItemId',
    optional: true,
    autoform: {
      omit: true
    }
  }
};
Posts.addField(feedItemIdProperty);

Meteor.startup(function () {
  Feeds.allow({
    insert: Users.is.adminById,
    update: Users.is.adminById,
    remove: Users.is.adminById
  });

  Meteor.methods({
    insertFeed: function(feedUrl){
      check(feedUrl, Feeds.schema);

      if (Feeds.findOne({url: feedUrl.url}))
        throw new Meteor.Error('already-exists', i18n.t('feed_already_exists'));

      if (!Meteor.user() || !Users.is.admin(Meteor.user()))
        throw new Meteor.Error('login-required', i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_feed'));

      return Feeds.insert(feedUrl);
    }
  });
});
