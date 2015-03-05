Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  PostsCategoryController = PostsListController.extend({
    
    view: 'category',

    getCurrentCategory: function () {
      return Categories.findOne({slug: this.params.slug});
    },

    getTitle: function () {
      var category = this.getCurrentCategory();
      return category.name + ' - ' + getSetting('title', 'Telescope');
    },

    getDescription: function () {
      return this.getCurrentCategory().description;    
    }

  });

  // Categories

  Router.route('/category/:slug/:limit?', {
    name: 'posts_category',
    controller: PostsCategoryController,
    onAfterAction: function() {
      this.slug = this.params.slug;
      Session.set('categorySlug', this.params.slug);
    }
  });

  // Categories Admin

  Router.route('/categories', {
    name: 'categories'
  });


});