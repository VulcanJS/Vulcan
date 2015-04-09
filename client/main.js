// Session variables
Session.set('postsLimit', Settings.get('postsPerPage', 10));

// Sort postModules array position using modulePositions as index
postModules = _.sortBy(postModules, 'order');

postHeading = _.sortBy(postHeading, 'order');

postMeta = _.sortBy(postMeta, 'order');

Meteor.startup(function () {
  $('#rss-link').attr('title', i18n.t('new_posts'));
});

// AutoForm.debug();

Meteor.startup(function() {

  var seoProperties = {
    meta: {},
    og: {}
  }
  
  var title = Settings.get("title", "Telescope");
  if (!!Settings.get("tagline")) {
    title += ": "+Settings.get("tagline");
  }

  seoProperties.title = title;

  if (!!Settings.get("description")) {
    seoProperties.meta.description = Settings.get("description");
    seoProperties.og.description = Settings.get("description");
  }

  if (!!Settings.get("siteImage")) {
    seoProperties.og.image = Settings.get("siteImage");
  }

  SEO.config(seoProperties);

});
