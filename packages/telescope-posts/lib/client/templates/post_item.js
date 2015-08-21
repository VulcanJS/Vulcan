var post = {};

Template.post_item.created = function () {
  post = this.data;
};

Template.post_item.helpers({
  moduleContext: function () { // not used for now
    var module = this;
    module.templateClass = Telescope.utils.camelToDash(this.template) + ' ' + this.position + ' cell';
    module.post = post;
    return module;
  },
  postClass: function () {
    var post = this;
    var postClass = "post ";
    
    postClass += "author-"+Telescope.utils.slugify(post.author)+" ";

    if (this.sticky) {
      postClass += "sticky ";
    }
    postClass = Telescope.callbacks.run("postClass", postClass, post);
    return postClass;
  }
});
