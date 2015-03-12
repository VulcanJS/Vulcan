Template[getTemplate('posts_list')].created = function() {
  Session.set('listPopulatedAt', new Date());
};

Template[getTemplate('posts_list')].helpers({
  postsLayout: function () {
    return getSetting('postsLayout', 'posts-list');
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
  }
});