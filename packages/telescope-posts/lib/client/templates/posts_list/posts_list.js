// ----------------------------------- Post List -----------------------------------//

Template.posts_list.created = function() {
  Session.set('listPopulatedAt', new Date());
};

Template.posts_list.helpers({
  postsLayout: function () {
    return Settings.get('postsLayout', 'posts-list');
  },
  description: function () {
    var controller = Iron.controller();
    if (typeof controller.getDescription === 'function')
      return Iron.controller().getDescription();
  },
  postsCursor : function () {
    if (this.postsCursor) { // not sure why this should ever be undefined, but it can apparently
      var posts = this.postsCursor.map(function (post, index) {
        post.rank = index;
        return post;
      });
      return posts;
    } else {
      console.log('postsCursor not defined');
    }
  }
});

// ----------------------------------- Incoming -----------------------------------//

Template.postsListIncoming.events({
  'click .show-new': function() {
    Session.set('listPopulatedAt', new Date());
  }
});

// ----------------------------------- Load More -----------------------------------//

Template.postsLoadMore.helpers({
  postsReady: function () {
    return this.postsReady;
  },
  hasPosts: function () {
    return !!this.postsCursor.count();
  }
});

Template.postsLoadMore.events({
  'click .more-button': function (event) {
    event.preventDefault();
    if (this.controllerInstance) {
      // controller is a template
      this.loadMoreHandler(this.controllerInstance);
    } else {
      // controller is router
      this.loadMoreHandler();
    }
  }
});
