Template[getTemplate('posts_list')].helpers({
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
  posts : function () {
    if(this.postsList){ // XXX
      this.postsList.rewind();    
      var posts = this.postsList.map(function (post, index, cursor) {
        post.rank = index;
        return post;
      });
      return posts;
    }
  },
  postsLoadMore: function () {
    return getTemplate('postsLoadMore');
  },
  postsListIncoming: function () {
    return getTemplate('postsListIncoming');
  }
});

Template[getTemplate('posts_list')].created = function() {
  Session.set('listPopulatedAt', new Date());
};