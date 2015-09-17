Template.user_controller.onCreated(function () {
  var template = this;
  template.subscribe('singleUser', FlowRouter.getParam("_idOrSlug"));
});

Template.user_controller.helpers({
  data: function () {

    var idOrSlug = FlowRouter.getParam("_idOrSlug");
    var findById = Meteor.users.findOne(idOrSlug);
    var findBySlug = Meteor.users.findOne({"telescope.slug": idOrSlug});

    return {user: findById || findBySlug};

  }
});