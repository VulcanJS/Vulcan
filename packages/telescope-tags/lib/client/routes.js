Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['categories']});

  // clear any categories checkboxes
  Router.onBeforeAction(function () {
    if (this.route.getName() !== "posts_categories") {
      $(".categories-menu input:checkbox").prop("checked", false);
    }
    this.next();
  });

  Posts.controllers.category = Posts.controllers.list.extend({

    view: 'category',

    showViewsNav: false,

    data: function () {

      var terms = {
        view: "category",
        limit: this.params.limit || Settings.get('postsPerPage', 10),
        categorySlugs: this.getSlugs()
      };

      // note: the post list controller template will handle all subscriptions, so we just need to pass in the terms
      return {
        terms: terms
      };
    },

    getSlugs: function () {
      var slugs = [];
      if (typeof this.params.slug !== "undefined") {
        slugs = [this.params.slug];
      } else if (typeof this.params.query.cat !== "undefined") {
        slugs = this.params.query.cat;
      }
      return slugs;
    },

    getCurrentCategories: function () {
      return Categories.find({slug: {$in: this.getSlugs()}}).fetch();
    },

    getTitle: function () {
      var title = "";
      this.getCurrentCategories().forEach(function (category){
        title += category.name + " | ";
      });
      return title.substring(0, title.length - 3); // remove last three characters
    },

    getDescription: function () {
      // just keep description of first category
      var firstCategory = this.getCurrentCategories()[0];
      return firstCategory && firstCategory.description;
    }

  });

  // Categories

  Router.route('/category/:slug/:limit?', {
    name: 'posts_category',
    controller: Posts.controllers.category,
    onAfterAction: function() {
      this.slug = this.params.slug;
    }
  });

  Router.route('/categories/:limit?', {
    name: 'posts_categories',
    controller: Posts.controllers.category
  });

  // Categories Admin

  Router.route('/admin/categories', {
    controller: Telescope.controllers.admin,
    name: 'admin/categories',
    template: 'categories_admin'
  });

});
