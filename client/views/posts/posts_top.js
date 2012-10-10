Template.posts_top.posts = function(){
  return Posts.find();
};

Template.posts_top.created = function(){
  var postsPerPage=10;
  var pageNumber=Session.get('currentPageNumber') || 1;
  var postsView={
    find: {},
    sort: {score: -1},
    skip: 0,
    limit: postsPerPage,
    postsPerPage: postsPerPage,
    page: pageNumber
  }
  sessionSetObject('postsView', postsView);
}

Template.posts_top.helpers({
  moreLinkDistance: function(){
    return (Posts.find().count()+1)*80;
  },
  allPostsLoaded: function(){
    var postsView=sessionGetObject('postsView');
    return Posts.find().count() < postsView.skip + postsView.limit;
  }
});

Template.posts_top.events({
  'click .more-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    postsView.limit+=postsView.postsPerPage;
    postsView.pageNumber++;
    sessionSetObject('postsView', postsView);
  }
});

