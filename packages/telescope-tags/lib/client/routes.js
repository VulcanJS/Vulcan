Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  Posts.controllers.category = Posts.controllers.list.extend({

    view: 'category',

    showViewsNav: false,

    onBeforeAction: function () {
      this.render('categoryTitle', {to: 'postListTop'});
      this.next();
    },

    getCurrentCategory: function () {
      return Categories.findOne({slug: this.params.slug});
    },

    getTitle: function () {
      return this.getCurrentCategory().name;
    },

    getDescription: function () {
      return this.getCurrentCategory().description;
    }

  });

  // Categories

  Router.route('/category/:slug/:limit?', {
    name: 'posts_category',
    controller: Posts.controllers.category,
    onAfterAction: function() {
      this.slug = this.params.slug;
      Session.set('categorySlug', this.params.slug);
    }
  });

  // Categories Admin

  Router.route('/categories', {
    controller: Telescope.controllers.admin,
    name: 'categories'
  });

});
