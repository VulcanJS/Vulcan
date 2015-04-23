var post = {};

Template.post_item.created = function () {
  post = this.data;
};

Template.post_item.helpers({
  postComponents: function () {
    return Telescope.getModules("postComponents");
  },
  moduleContext: function () { // not used for now
    var module = this;
    module.templateClass = Telescope.utils.camelToDash(this.template) + ' ' + this.position + ' cell';
    module.post = post;
    return module;
  },
  moduleClass: function () {
    return Telescope.utils.camelToDash(this.template) + ' post-module';
  },
  postClass: function () {
    var post = this;
    var postAuthorClass = "author-"+post.author;


    var postClass = Telescope.runCallbacks("postClass", postAuthorClass);

    return postClass;
  }
});
