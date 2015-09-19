FlowRouter.addToQueryArray = function (key, value) {
  var keyArray = FlowRouter.getQueryParam(key) || [];
  keyArray.push(value);
  var params = {};
  params[key] = keyArray;
  FlowRouter.setQueryParams(params);
}

FlowRouter.removeFromQueryArray = function (key, value) {
  var keyArray = FlowRouter.getQueryParam(key);
  keyArray = _.without(keyArray, value);
  var params = {};
  params[key] = keyArray;
  FlowRouter.setQueryParams(params);
}

Telescope.adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin'
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("layout", {main: "not_found"});
  }
};

FlowRouter.triggers.exit([Messages.clearSeen]);
FlowRouter.triggers.exit([Events.analyticsInit]); // will only run once thanks to _.once()
FlowRouter.triggers.exit([Events.analyticsRequest]);