Template.posts_top.posts = function(){
  return Posts.find();
};

Template.posts_top.created = function(){
  var postsPerPage=5;
  var pageNumber=Session.get('currentPageNumber') || 1;
  var postsView={
    find: {},
    sort: {score: -1},
    limit: postsPerPage,
    postsPerPage: postsPerPage,
    page: pageNumber
  }
  sessionSetObject('postsView', postsView);
}

Template.posts_top.events({
  'click button.more': function() {
    var postsView=sessionGetObject('postsView');
    postsView.limit+=postsView.postsPerPage;
    postsView.pageNumber++;
    sessionSetObject('postsView', postsView);
  }
});

