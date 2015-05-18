// Controller for user pages

Users.controllers = {};

Users.controllers.page = RouteController.extend({

  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleUser', this.params._idOrSlug)
    ];
  },

  getUser: function () {
    return Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});
  },

  data: function() {

    var findById = Meteor.users.findOne(this.params._idOrSlug);
    var findBySlug = Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});

    if (typeof findById !== 'undefined') {
      // redirect to slug-based URL
      Router.go(Users.getProfileUrl(findById), {replaceState: true});
    } else {
      return {
        user: findById || findBySlug
      };
    }

  },

  getTitle: function () {
    return Users.getDisplayName(this.getUser());
  },

  getDescription: function () {
    return i18n.t('the_profile_of') + ' ' + Users.getDisplayName(this.getUser());
  },

  fastRender: true

});

// Controller for user account editing

Users.controllers.edit = RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleUser', this.params.slug)
    ];
  },
  data: function() {
    // if there is no slug, default to current user
    var user = !!this.params.slug ? Meteor.users.findOne({"telescope.slug": this.params.slug}) : Meteor.user();
    return {
      user: user
    };
  },
  fastRender: true
});

Meteor.startup(function () {

// User Logout

  Router.route('/sign-out', {
    name: 'signOut',
    template: 'sign_out',
    onBeforeAction: function() {
      Meteor.logout(function() {
      });
      this.next();
    }
  });

  // User Profile

  Router.route('/users/:_idOrSlug', {
    name: 'user_profile',
    template: 'user_profile',
    controller: Users.controllers.page
  });

  // User Edit

  Router.route('/users/:slug/edit', {
    name: 'user_edit',
    template: 'user_edit',
    controller: Users.controllers.edit,
    onBeforeAction: function () {
      // Only allow users with permissions to see the user edit page.
      if (Meteor.user() && (
        Users.is.admin(Meteor.user()) ||
        this.params.slug === Meteor.user().telescope.slug
      )) {
        this.next();
      } else {
        this.render('no_rights');
      }
    }
  });

  Router.route('/account', {
    name: 'userAccountShortcut',
    template: 'user_edit',
    controller: Users.controllers.edit
  });

  // All Users

  Router.route('/users-dashboard', {
    controller: Telescope.controllers.admin,
    name: 'users_dashboard'
  });

  // Unsubscribe (from notifications)

  Router.route('/unsubscribe/:hash', {
    name: 'unsubscribe',
    template: 'unsubscribe',
    data: function() {
      return {
        hash: this.params.hash
      };
    }
  });

});
