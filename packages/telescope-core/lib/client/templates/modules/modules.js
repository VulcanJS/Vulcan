Template.modules.helpers({
  isDebug: function () {
    return Session.get('debug');
  },
  getClass: function () {
    var zoneClass = "zone-wrapper ";
    if (this.zoneClass) {
      zoneClass += this.zoneClass;
    } else {
      zoneClass += this.zone;
    }
    return zoneClass;
  },
  getId: function () {
    return this.wrapperId;
  },
  getModules: function () {
    var modules = this;

    var zoneModules = Telescope.modules.get(modules.zone).map(function (module) {

      // use deep copy to avoid modifying original module when extending it with modules property
      var newModule = jQuery.extend(true, {}, module);
      newModule.modules = modules;
      return newModule;

    });

    return zoneModules;
  },
  showModule: function () {
    var module = this;

    // if module should only run on specific routes, test for them
    if (module.only) {
      if (Array.isArray(module.only)) {
        return _.contains(module.only, FlowRouter.getRouteName());
      } else {
        return module.only();
      }
    }

    // if module should *not* run on specific routes, test for them
    if (module.except) {
      if (Array.isArray(module.except)) {
        return !_.contains(module.except, FlowRouter.getRouteName());
      } else {
        return module.except();
      }
    }

    return true;
  },
  moduleData: function () {
    var data = _.extend({
      zone: this.modules.zone,
      moduleClass: this.modules.moduleClass
    }, this.modules.moduleData);
    return data;
  }
});