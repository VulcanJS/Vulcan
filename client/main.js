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

Template.onRendered(function () {
  var $svgs = this.$('img.svg');
  if ($svgs.length) {
    SVGInjector($svgs, {
      each: function (svg) {
        $(svg).css('visibility', 'visible');
      }
    });
  }
});