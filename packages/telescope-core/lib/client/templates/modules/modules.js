Template.modules.helpers({
  getModules: function () {
    var zone = this.toString();
    return Telescope.getModules(zone);
  }
});