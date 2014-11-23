// Controller for user pages

UserPageController = FastRender.RouteController.extend({
  waitOn: function() {
    return [
      coreSubscriptions.subscribe('userProfile', this.params._idOrSlug)
    ]
  },
  data: function() {
    var findById = Meteor.users.findOne(this.params._idOrSlug);
    var findBySlug = Meteor.users.findOne({slug: this.params._idOrSlug});
    if(typeof findById !== "undefined"){
      // redirect to slug-based URL
      Router.go(getProfileUrl(findById), {replaceState: true});
    }else{
      return {
        user: (typeof findById == "undefined") ? findBySlug : findById
      };
    }
  }
});

// Controller for user account editing

AccountController = FastRender.RouteController.extend({
  waitOn: function() {
    return coreSubscriptions.subscribe('invites');
  },
  data: function() {
    return {
      user : Meteor.user(),
      invites: Invites.find({invitingUserId:Meteor.userId()})
    };
  }
});

Meteor.startup(function () {

// User Logout

  Router.route('/sign-out', {
    name: 'signOut',
    onBeforeAction: function() {
      Meteor.logout(function() {
        return Router.go('/');
      });
    }
  });

  // User Profile

  Router.route('/users/:_idOrSlug', {
    name: 'user_profile',
    template: getTemplate('user_profile'),
    controller: UserPageController
  });

  // User Edit

  Router.route('/users/:_idOrSlug/edit', {
    name: 'user_edit',
    template: getTemplate('user_edit'),
    controller: UserPageController
  });

  // Account

  Router.route('/account', {
    name: 'account',
    template: getTemplate('user_edit'),
    controller: AccountController
  });

  // All Users

  Router.route('/all-users/:limit?', {
    name: 'all-users',
    template: getTemplate('users'),
    waitOn: function() {
      var limit = parseInt(this.params.limit) || 20;
      return coreSubscriptions.subscribe('allUsers', this.params.filterBy, this.params.sortBy, limit);
    },
    data: function() {
      var limit = parseInt(this.params.limit) || 20,
          parameters = getUsersParameters(this.params.query.filterBy, this.params.query.sortBy, limit),
          filterBy = (typeof this.params.query.filterBy === 'string') ? this.params.query.filterBy : 'all',
          sortBy = (typeof this.params.query.sortBy === 'string') ? this.params.query.sortBy : 'createdAt';
      Session.set('usersLimit', limit);
      return {
        users: Meteor.users.find(parameters.find, parameters.options),
        filterBy: filterBy,
        sortBy: sortBy
      };
    },
    fastRender: true
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