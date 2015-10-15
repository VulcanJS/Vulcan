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
  showInfiniteScroll: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "button") {
      return false;
    } else {
      return this.hasMorePosts;
    }
  },
  showLoadMoreButton: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "scroll") {
      return false;
    } else {
      return this.hasMorePosts;
    }
  },
  hasPosts: function () {
    return !!this.postsCursor.count();
  }
});

Template.postsLoadMore.onCreated(function () {

  var context = Template.currentData();

  if (context.controllerOptions && context.controllerOptions.loadMoreBehavior === "scroll") {

    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() === $(document).height()) {
        context.loadMoreHandler(context.controllerInstance);
      }
    });

  }
});

Template.postsLoadMore.events({
  'click .more-button': function (event) {
    event.preventDefault();
    this.loadMoreHandler(this.controllerInstance);
  }
});
