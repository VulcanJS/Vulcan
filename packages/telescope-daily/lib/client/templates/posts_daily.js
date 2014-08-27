var getPosts = function (date) {
  var terms = {
        view: 'digest',
        after: moment(date).startOf('day').toDate(),
        before: moment(date).endOf('day').toDate()
      };
  var parameters = getParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options).map(function (post, index, cursor) {
    post.rank = index;
    return post;
  });
  return posts;
}

Template[getTemplate('postsDaily')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  days: function () {
    console.log(this)
    var daysArray = [];
    for (i = 0; i < this.days; i++) {
      daysArray.push({
        date: moment().subtract('days', i).startOf('day').toDate()
      });
    }
    return daysArray;
  },
  posts: function () {
    return getPosts(this.date);
  },
  hasMorePosts: function(){
    // as long as we ask for N posts and all N posts showed up, then keep showing the "load more" button
    return parseInt(Session.get('postsLimit')) == this.postsCount
  },
  loadMoreUrl: function () {
    var count = parseInt(Session.get('postsLimit')) + parseInt(getSetting('postsPerPage', 10));
    var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';
    return '/' + Session.get('view') + '/' + categorySegment + count;
  }
});