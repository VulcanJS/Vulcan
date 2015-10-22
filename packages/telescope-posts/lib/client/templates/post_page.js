var doSEOStuff = function (post) {

  var link = {rel: "canonical", href: "post.getPageUrl(true)"};
  DocHead.addLink(link);
  
  // Set SEO properties
  
  var seoProperties = {meta: {}};

  // Set site name
  DocHead.addMeta({property: "og:site_name", content: Settings.get("title")});

  // Set title
  Telescope.SEO.setTitle(post.title);

  // Set description
  if (!!post.body) {
    var description = Telescope.utils.trimWords(post.body, 100);
    Telescope.SEO.setDescription(description);
  }

  // Set image
  if (!!post.thumbnailUrl) {
    var image = Telescope.utils.addHttp(post.thumbnailUrl);
    DocHead.addMeta({property: "twitter:card", content: "summary_large_image"});
    Telescope.SEO.setImage(image);
  }

  // Set Twitter username
  if (!!Settings.get("twitterAccount")) {
    DocHead.addMeta({property: "twitter:site", content: Settings.get("twitterAccount")});
  }
  
};

Template.post_page.onCreated(function () {

  var template = this;
  var postId = FlowRouter.getParam("_id");

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  var postSubscription = Telescope.subsManager.subscribe('singlePost', postId);
  var postUsersSubscription = Telescope.subsManager.subscribe('postUsers', postId);
  var commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'postComments', postId: postId});
  
  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {

    var subscriptionsReady = postSubscription.ready(); // ⚡ reactive ⚡

    // if subscriptions are ready, set terms to subscriptionsTerms and update SEO stuff
    if (subscriptionsReady) {
      template.ready.set(true);
      var post = Posts.findOne(FlowRouter.getParam("_id"));
      if (post) {
        doSEOStuff(post);
      } else {
        DocHead.addMeta({
          name: "name",
          property: "prerender-status-code",
          content: "404"
        });
        DocHead.addMeta({
          name: "name",
          property: "robots",
          content: "noindex, nofollow"
        });
      }
    }
  });

});

Template.post_page.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  post: function () {
    return Posts.findOne(FlowRouter.getParam("_id"));
  },
  canView: function () {
    var post = this;
    var user = Meteor.user();
    if (post.status === Posts.config.STATUS_PENDING && !Users.can.viewPendingPost(user, post)) {
      return false;
    } else if (post.status === Posts.config.STATUS_REJECTED && !Users.can.viewRejectedPost(user, post)) {
      return false;
    }
    return true;
  },
  isPending: function () {
    return this.status === Posts.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
