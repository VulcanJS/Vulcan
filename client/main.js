// Session variables
Session.set('postsLimit', getSetting('postsPerPage', 10));

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
  
  var title = getSetting("title", "Telescope");
  if (!!getSetting("tagline")) {
    title += ": "+getSetting("tagline");
  }

  seoProperties.title = title;

  if (!!getSetting("description")) {
    seoProperties.meta.description = getSetting("description");
    seoProperties.og.description = getSetting("description");
  }

  if (!!getSetting("siteImage")) {
    seoProperties.og.image = getSetting("siteImage");
  }

  SEO.config(seoProperties);

});