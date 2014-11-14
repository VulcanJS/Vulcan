preloadSubscriptions.push('categories');

adminNav.push({
  route: 'categories',
  label: 'Categories'
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  PostsCategoryController = PostsListController.extend({
    view: 'category'
  });

  Router.map(function() {

    // Categories

    this.route('posts_category', {
      path: '/category/:slug/:limit?',
      controller: PostsCategoryController,
      onAfterAction: function() {
        Session.set('categorySlug', this.params.slug);
      }
    });

    // Categories Admin

    this.route('categories');

  });

});