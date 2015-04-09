// ----------------------------------- Post List -----------------------------------//

Template[getTemplate('posts_list')].created = function() {
  Session.set('listPopulatedAt', new Date());
};

Template[getTemplate('posts_list')].helpers({
  postsLayout: function () {
    return Settings.get('postsLayout', 'posts-list');
  },
  description: function () {
    var controller = Iron.controller();
    if (typeof controller.getDescription === 'function')
      return Iron.controller().getDescription();
  },
  before_post_item: function () {
    return getTemplate('before_post_item');
  },
  post_item: function () {
    return getTemplate('post_item');
  },
  after_post_item: function () {
    return getTemplate('after_post_item');
  },
  postsCursor : function () {
    if (this.postsCursor) { // not sure why this should ever be undefined, but it can apparently
      var posts = this.postsCursor.map(function (post, index, cursor) {
        post.rank = index;
        return post;
      });
      return posts;
    } else {
      console.log('postsCursor not defined')
    }
  },
  postsLoadMore: function () {
    return getTemplate('postsLoadMore');
  },
  postsListIncoming: function () {
    return getTemplate('postsListIncoming');
  },
  postsListSort: function () {
    return getTemplate('postsListSort');
  }
});

// ----------------------------------- Incoming -----------------------------------//

Template[getTemplate('postsListIncoming')].events({
  'click .show-new': function(e, instance) {
    Session.set('listPopulatedAt', new Date());
  }
});

// ----------------------------------- Load More -----------------------------------//

Template[getTemplate('postsLoadMore')].helpers({
  postsReady: function () {
    return this.postsReady;
  },
  hasPosts: function () {
    return !!this.postsCursor.count();
  }  
});

Template[getTemplate('postsLoadMore')].events({
  'click .more-button': function (event, instance) {
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
