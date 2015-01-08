Template[getTemplate('postsLoadMore')].helpers({
  // hasMorePosts: function(){
  //   // as long as we ask for N posts and all N posts showed up, then keep showing the "load more" button
  //   console.log(this)
  //   return parseInt(Session.get('postsLimit')) == this.postsCount
  // },
  loadMoreUrl: function () {
    var count = parseInt(Session.get('postsLimit')) + parseInt(getSetting('postsPerPage', 10));
    var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';
    return '/' + Session.get('view') + '/' + categorySegment + count;
  }
});

Template[getTemplate('postsLoadMore')].events({
  'click .more-button': function (event, instance) {
    event.preventDefault();
    this.loadMoreHandler(event, this.controllerInstance);
  }
})