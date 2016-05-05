Meteor.methods({
  'feeds.new'(feed) {
    check(feed, Feeds.schema);

    if (Feeds.findOne({url: feed.url}))
      throw new Meteor.Error('already-exists', __('This feed already exists'));

    if (!Meteor.user() || !Users.is.admin(Meteor.user()))
      throw new Meteor.Error('login-required', __('You need to be logged in and be an admin to add a new feed'));

    return Feeds.insert(feed);
  },

  'feeds.edit'(feed) {
    // use smart-method
  },
  
  'feeds.remove'(feedId) {
    check(feedId, String);

    if (!Feeds.findOne({_id: feedId}))
      throw new Meteor.Error('already-exists', __('This feed doesn\'t exist'));

    if (!Meteor.user() || !Users.is.admin(Meteor.user()))
      throw new Meteor.Error('login-required', __('You need to be logged in and be an admin to remove a new feed'));

    return Feeds.remove({_id: feedId});
  },
});

