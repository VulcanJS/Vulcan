var feedSchema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  userId: {
    type: String,
    label: 'feedUser',
    autoform: {
      instructions: 'Posts will be assigned to this user.',
      options: function () {
        var users = Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: getDisplayName(user)
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

Feeds = new Meteor.Collection('feeds');
Feeds.attachSchema(feedSchema);

// used to keep track of which feed a post was imported from
var feedIdProperty = {
  propertyName: 'feedId',
  propertySchema: {
    type: String,
    label: 'feedId',
    optional: true,
    autoform: {
      omit: true
    }
  }
}
addToPostSchema.push(feedIdProperty);

// the RSS ID of the post in its original feed
var feedItemIdProperty = {
  propertyName: 'feedItemId',
  propertySchema: {
    type: String,
    label: 'feedItemId',
    optional: true,
    autoform: {
      omit: true
    }
  }
}
addToPostSchema.push(feedItemIdProperty);

Meteor.startup(function () {
  Feeds.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
  });

  Meteor.methods({
    insertFeed: function(feedUrl){
      check(feedUrl, feedSchema);

      if (Feeds.findOne({url: feedSchema.url}))
        throw new Meteor.Error('already-exists', i18n.t('feed_already_exists'));

      if (!Meteor.user() || !isAdmin(Meteor.user()))
        throw new Meteor.Error('login-required', i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_feed'));

      return Feeds.insert(feedUrl);
    }
  });
});
