Meteor.startup(function() {
  // Inject SEO tags.
  Router.onAfterAction(function() {
    var props = {meta: {}, og: {}};
    var title = this.getTitle && this.getTitle();
    var description = this.getDescription && this.getDescription();
    var image = Settings.get("siteImage");
    if (title) {
      props.og.title = title;
    }
    if (description) {
      props.meta.description = description;
      props.og.description = description;
    }
    if (image) {
      props.og.image = image;
    }
    SEO.set(props);
  });

  // Add canonical URL to post pages
  Router.onAfterAction(function() {
    var post = Posts.findOne(this.params._id);
    if (post) {
      SEO.set({link: {canonical: getPostPageUrl(post)}});
    }
  }, {only: ["post_page", "post_page_with_slug"]});

});
