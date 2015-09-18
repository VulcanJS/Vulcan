Template.main_posts_list.helpers({
  customTemplate: function () {
    var currentView = FlowRouter.getQueryParam("view") || Settings.get("defaultView", "top");
    return _.findWhere(Telescope.menuItems.viewsMenu, {label: currentView}).viewTemplate;
  },
  arguments: function () {
    FlowRouter.watchPathChange();
    var terms = _.clone(FlowRouter.current().queryParams);
    terms.enableCache = true;
    return {
      terms: terms
    };
  }
});