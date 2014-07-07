var filteredModules = function (positions) {
  return _.filter(postModules, function(module){return _.contains(positions, module.position)});
}

var post = {};

Template[getTemplate('post_item')].created = function () {
  post = this.data;
};

Template[getTemplate('post_item')].helpers({
  leftPostModules: function () {
    return filteredModules(['left-left', 'left-center', 'left-right']);
  },
  centerPostModules: function () {
    return filteredModules(['center-left', 'center-center', 'center-right']);
  },
  rightPostModules: function () {
    return filteredModules(['right-left', 'right-center', 'right-right']);
  },
  moduleContext: function () {
    var moduleContext = _.extend(this, post);
    moduleContext.templateClass = camelToDash(moduleContext.template);
    moduleContext._id = null;
    return moduleContext;
  },
  moduleClass: function () {
    return camelToDash(this.template) + ' ' + this.position + ' cell';
  }
});
