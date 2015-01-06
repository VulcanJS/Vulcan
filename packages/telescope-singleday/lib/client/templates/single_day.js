Template[getTemplate('singleDay')].helpers({
  singleDayNav: function () {
    return getTemplate('singleDayNav');
  },
  posts_list: function () {
    return getTemplate('posts_list');
  },
  context: function () {
    var context = this;
    context.ready = true;
    return context;
  }
});