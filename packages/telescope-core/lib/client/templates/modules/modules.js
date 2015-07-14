Template.modules.helpers({
  isDebug: function () {
    return Session.get('debug');
  },
  getZone: function () {
    return this.zone || this.toString();
  },
  getClass: function () {
    var wrapperClass = "zone-wrapper ";
    if (this.wrapperClass)
      wrapperClass += this.wrapperClass;
    return wrapperClass;
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
  }
});