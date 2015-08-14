Template.modules.helpers({
  isDebug: function () {
    return Session.get('debug');
  },
  getZone: function () {
    return this.zone || this.toString();
  },
  getClass: function () {
    var zoneClass = "zone-wrapper ";
    if (this.zoneClass)
      zoneClass += this.zoneClass;
    return zoneClass;
  },
  getId: function () {
    return this.wrapperId;
  },
  getModules: function () {
    // look for the zone name in either the zone variable, or the data context itself
    var zone = this.zone || this.toString();
    var moduleClass = this.moduleClass;
    return _.map(Telescope.modules.get(zone), function (module){
      module.moduleClass = moduleClass;
      return module;
    });
  },
  showModule: function () {
    var module = this;

    // if module should only run on specific routes, test for them
    if (module.only) {
      return _.contains(module.only, Router.current().route.getName());
    }

    // if module should *not* run on specific routes, test for them
    if (module.except) {
      return !_.contains(module.except, Router.current().route.getName());
    }

    return true;
  },
  moduleData: function () {
    var zoneData = this;
    var moduleData = Template.parentData(2) || {}; // parent template might not always have data context
    if (zoneData.moduleClass) {
      moduleData.moduleClass = zoneData.moduleClass;
    }
    return moduleData;
  }
});