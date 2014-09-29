var daysPerPage = 5;

var getPosts = function (date) {
  var terms = {
    view: 'digest',
    after: moment(date).startOf('day').toDate(),
    before: moment(date).endOf('day').toDate()
  };
  var parameters = getPostsParameters(terms);
  var posts = Posts.find(parameters.find, parameters.options).map(function (post, index, cursor) {
    post.rank = index;
    return post;
  });
  return posts;
}

Meteor.startup(function () {

  Template[getTemplate('postsDaily')].helpers({
    postsLoaded: function () {
      return !!Session.get('postsLoaded');
    },
    post_item: function () {
      return getTemplate('post_item');
    },
    days: function () {
      var daysArray = [];
      // var days = this.days;
      var days = Session.get('postsDays');
      for (i = 0; i < days; i++) {
        daysArray.push({
          date: moment().subtract(i, 'days').startOf('day').toDate()
        });
      }
      return daysArray;
    },
    posts: function () {
      return getPosts(this.date);
    },
    loadMoreUrl: function () {
      var count = parseInt(Session.get('postsDays')) + daysPerPage;
      return '/daily/' + count;
    }
  });

});
