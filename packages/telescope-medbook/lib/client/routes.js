preloadSubscriptions.push('crfs');

adminNav.push({
  route: 'crfs',
  label: 'CRFs'
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['crfs']});

  PostsCRFController = PostsListController.extend({
    view: 'crf'
  });

  Router.map(function() {

    // CRFs

    this.route('posts_crf', {
      path: '/crf/:slug/:limit?',
      controller: PostsCRFController,
      onAfterAction: function() {
        Session.set('crfSlug', this.params.slug);
      }
    });

    // CRFs Admin

    this.route('crfs');

  });

});
