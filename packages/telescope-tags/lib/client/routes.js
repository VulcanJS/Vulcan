Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  Router.map(function() {

    // Categories

    this.route('posts_category', {
      path: '/category/:slug/:limit?',
      controller: PostsListController,
      onAfterAction: function() {
        console.log('cat slug')
        Session.set('categorySlug', this.params.slug);
      }
    });

    // Categories Admin

    this.route('categories');

  });

});