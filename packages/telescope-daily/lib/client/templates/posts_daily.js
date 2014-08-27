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
  postsLoaded: function () {
    return !!Session.get('postsLoaded');
  },
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
  loadMoreUrl: function () {
    return '/daily/' + (parseInt(this.days) + 3);
  }
});

// Template[getTemplate('postsDaily')].events({
//   'click .more-button': function (e) {
//     e.preventDefault();
//   } 
// });