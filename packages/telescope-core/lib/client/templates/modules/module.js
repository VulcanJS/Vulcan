Template.module.helpers({
  hasWrapper: function () {
    return !!this.moduleClass; // only add a wrapper if a class has been specified
  },
  wrapperClass: function () {
    var module = this;
    return Telescope.utils.underscoreToDash(module.template) + " " + module.moduleClass;
  }
});