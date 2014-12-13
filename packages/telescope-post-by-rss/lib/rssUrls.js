// rssUrl schema
rssUrlSchema = new SimpleSchema({
 _id: {
    type: String,
    optional: true
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
});

RssUrls = new Meteor.Collection("rss_urls", {
  schema: rssUrlSchema
});

Meteor.startup(function () {
  RssUrls.allow({
    remove: isAdminById
  });

  Meteor.methods({
    insertRssUrl: function(rssUrl){
      check(rssUrl, rssUrlSchema);

      if (RssUrls.findOne({url: rssUrl.url}))
        throw new Meteor.Error('already-exists', i18n.t('rss_url_is_already_exists'));

      if (!Meteor.user() || !isAdmin(Meteor.user()))
        throw new Meteor.Error('login-required', i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_rss_url'));

      return RssUrls.insert(rssUrl);
    }
  });
});
