var init = _.once(function () {
  var title = Settings.get("title", "Telescope");
  if (!!Settings.get("tagline")) {
    title += ": "+Settings.get("tagline");
  }
  DocHead.setTitle(title);

  if (!!Settings.get("description")) {
    DocHead.addMeta({name: "description", content: Settings.get("description")});
    DocHead.addMeta({property: "og:description", content: Settings.get("description")});
  }

  if (!!Settings.get("siteImage")) {
    DocHead.addMeta({property: "og:image", content: Settings.get("siteImage")});
  }

  Events.analyticsInit();
});

Template.layout.onCreated(function (){

  DocHead.setTitle(i18n.t("loading"));

  Tracker.autorun(function () {

    if (FlowRouter.subsReady()) {
      init();
    }

  });


});

Template.layout.helpers({
  appIsReady: function () {
    return FlowRouter.subsReady();
  },
  notAllowed: function () {

    FlowRouter.watchPathChange();
    var user = Meteor.user();
    var userRoutes = ['signIn', 'signUp', 'changePwd', 'forgotPwd', 'resetPwd', 'enrollAccount', 'verifyEmail', 'signOut', 'userEdit', 'userProfile'];
    var isOnUserRoute = _.contains(userRoutes, FlowRouter.getRouteName());

    if (!isOnUserRoute && user && ! Users.userProfileComplete(user)){
      return {template: "user_complete"};
    }

    if (FlowRouter.current().route.group && FlowRouter.current().route.group.name === "admin" && !Users.is.admin(user)) {
      return {template: "no_rights", data: {message: i18n.t("sorry_you_need_to_be_an_admin_to_view_this_page")}};
    }

    if (!isOnUserRoute && !Users.can.view(user)) {
      return {template: "no_rights", data: {message: i18n.t("sorry_you_dont_have_the_rights_to_view_this_page")}};
    }

    if (FlowRouter.getRouteName() === "postSubmit") {
      if (!user) {
        return {template: "no_rights", data: {message: i18n.t("please_sign_in_first"), link: FlowRouter.path("signIn")}};
      } else if (!Users.can.post(user)) {
        return {template: "no_rights", data: {message: i18n.t("sorry_you_dont_have_permissions_to_add_new_items")}};
      }
    }

    return false;
  },
  navLayout: function () {
    return Settings.get('navLayout', 'top-nav');
  },
  pageName : function() {
    FlowRouter.watchPathChange();
    return FlowRouter.current().route.name;
  },
  extraCode: function() {
    return Settings.get('extraCode');
  }
});

Template.layout.onCreated( function () {
  Session.set('currentScroll', null);
});

Template.layout.onRendered( function () {
  var currentScroll = Session.get('currentScroll');
  if(currentScroll){
    $('body').scrollTop(currentScroll);
    Session.set('currentScroll', null);
  }

  // favicon
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = Settings.get('faviconUrl', '/img/favicon.ico');
  document.getElementsByTagName('head')[0].appendChild(link);

  // canonical
  var canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  document.getElementsByTagName('head')[0].appendChild(canonicalLink);
});

Template.layout.events({
  'click .inner-wrapper': function (e) {
    if ($('body').hasClass('mobile-nav-open')) {
      e.preventDefault();
      $('body').removeClass('mobile-nav-open');
    }
  }
});
