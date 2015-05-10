Template.modules.helpers({
  isDebug: function () {
    return Session.get('debug');
  },
  getZone: function () {
    return this.zone || this.toString();
  },
  getModules: function () {
    // look for the zone name in either the zone variable, or the data context itself
    var zone = this.zone || this.toString();
    var moduleClass = this.moduleClass;
    return _.map(Telescope.modules.get(zone), function (module){
      module.moduleClass = moduleClass;
      return module;
    });
  }
});