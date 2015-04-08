// Controller for user pages

UserPageController = RouteController.extend({

  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleUser', this.params._idOrSlug)
    ]
  },

  getUser: function () {
    return Meteor.users.findOne({slug: this.params._idOrSlug});
  },

  data: function() {
    var findById = Meteor.users.findOne(this.params._idOrSlug);
    var findBySlug = Meteor.users.findOne({slug: this.params._idOrSlug});
    if (typeof findById !== 'undefined') {
      // redirect to slug-based URL
      Router.go(getProfileUrl(findById), {replaceState: true});
    } else {
      return {
        user: (typeof findById == 'undefined') ? findBySlug : findById
      };
    }
  },

  getTitle: function () {
    return getDisplayName(this.getUser());
  },

  getDescription: function () {
    return i18n.t('the_profile_of') + ' ' + getDisplayName(this.getUser());
  },

  fastRender: true

});

// Controller for user account editing

UserEditController = RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('singleUser', this.params.slug)
    ]
  },
  data: function() {
    // if there is no slug, default to current user
    var user = !!this.params.slug ? Meteor.users.findOne({slug: this.params.slug}) : Meteor.user();
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
    template: getTemplate('sign_out'),
    onBeforeAction: function() {
      Meteor.logout(function() {
      });
      this.next();
    }
  });

  // User Profile

  Router.route('/users/:_idOrSlug', {
    name: 'user_profile',
    template: getTemplate('user_profile'),
    controller: UserPageController
  });

  // User Edit

  Router.route('/users/:slug/edit', {
    name: 'user_edit',
    template: getTemplate('user_edit'),
    controller: UserEditController,
    onBeforeAction: function () {
      // Only allow users with permissions to see the user edit page.
      if (Meteor.user() && (
        isAdmin(Meteor.user()) ||
        this.params.slug === Meteor.user().slug
      )) {
        this.next();
      } else {
        this.render(getTemplate('no_rights'));
      }
    }
  });

  Router.route('/account', {
    name: 'userAccountShortcut',
    template: getTemplate('user_edit'),
    controller: UserEditController
  });

  // All Users

  Router.route('/users-dashboard', {
    controller: AdminController,
    name: 'usersDashboard'
    // template: getTemplate('users')
  });

  // Unsubscribe (from notifications)

  Router.route('/unsubscribe/:hash', {
    name: 'unsubscribe',
    template: getTemplate('unsubscribe'),
    data: function() {
      return {
        hash: this.params.hash
      };
    }
  });

});
