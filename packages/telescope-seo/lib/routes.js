Meteor.startup(function() {
  var addSeoTags = function(descriptionFn, canonicalUrlFn) {
    var props = {link: {}, meta: {}, og: {}};
    var title = this.getTitle && this.getTitle();
    var description = descriptionFn.call(this);
    var image = getSetting("seoOgImage");
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
    if (canonicalUrlFn) {
      props.link.canonical = canonicalUrlFn.call(this);
    }
    SEO.set(props);
  };

  // Front page: prefer description from settings over this.getDescription.
  var frontPageDescription = function() {
    return getSetting("seoDescription") || (this.getDescription && this.getDescription());
  };

  // All others: prefer this.getDescription over settings.
  var notFrontPageDescription = function() {
    return (this.getDescription && this.getDescription()) || getSetting("seoDescription");
  };

  var frontPage = ["posts_" + getSetting("defaultView", "top").toLowerCase()];
  var postPage = ["post_page", "post_page_with_slug"];

  // Front page
  Router.onAfterAction(function() {
    addSeoTags.call(this, frontPageDescription);
  }, {only: frontPage});

  // Post detail pages
  Router.onAfterAction(function() {
    addSeoTags.call(this, notFrontPageDescription, function getCanonicalUrl() {
      var post = Posts.findOne(this.params._id);
      return getPostPageUrl(post);
    });
  }, {only: postPage});

  // All others
  Router.onAfterAction(function() {
    addSeoTags.call(this, notFrontPageDescription);
  }, {except: frontPage.concat(postPage)});
});
