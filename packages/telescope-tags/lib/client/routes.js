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


  // Categories

  Router.route('/category/:slug/:limit?', {
    name: 'posts_category',
    controller: PostsCategoryController,
    onAfterAction: function() {
      Session.set('categorySlug', this.params.slug);
    }
  });

  // Categories Admin

  Router.route('/categories', {
    name: 'categories'
  });


});