import Telescope from 'meteor/nova:lib';

Meteor.startup(() => {
  // note: add the keys *after* nova:i18n-en-us has been loaded!
  Telescope.strings.en = {
    ...Telescope.strings.en,
    "posts.subscribe": "Subscribe",
    "posts.unsubscribe": "Unsubscribe",
    "posts.subscribed_posts" : "Posts subscribed to",

    "users.subscribe": "Subscribe to this user's posts",
    "users.unsubscribe": "Unsubscribe to this user's posts",
    "users.subscribed_users" : "Users subscribed to",
    "users.subscribers": "Subscribers",

    "categories.subscribe": "Subscribe to this categorie's posts",
    "categories.unsubscribe": "Unsubscribe to this categorie's posts",
    "categories.subscribed_categories" : "Categories subscribed to",
  };
});