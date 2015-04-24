Template.modules.helpers({
  hasWrapper: function () {
    return !!this.moduleClass; // only add a wrapper if a class has been specified
  },
  wrapperClass: function () {
    var zone = Template.parentData(1);
    var module = this;
    return Telescope.utils.camelToDash(module.template) + " " + zone.moduleClass;
  },
  getModules: function () {
    // look for the zone name in either the zone variable, or the data context itself
    var zone = this.zone || this.toString();
    return Telescope.modules.get(zone);
  }
});