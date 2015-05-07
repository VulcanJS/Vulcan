Template.posts_list_compact.helpers({
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