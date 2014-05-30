preloadSubscriptions = typeof preloadSubscriptions === 'undefined' ? [] : preloadSubscriptions;
preloadSubscriptions.push('categories');

adminNav = typeof adminNav === 'undefined' ? [] : adminNav;
adminNav.push({
  route: 'categories',
  label: 'Categories'
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  Router.map(function() {

    // Categories

    this.route('posts_category', {
      path: '/category/:slug/:limit?',
      controller: PostsListController,
      onAfterAction: function() {
        Session.set('categorySlug', this.params.slug);
      }
    });

    // Categories Admin

    this.route('categories');

  });

});