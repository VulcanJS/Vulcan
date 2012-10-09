Template.posts_new.posts = function(){
  return Posts.find();
};

Template.posts_new.created = function(){
  var postsPerPage=5;
  var pageNumber=Session.get('currentPageNumber') || 1;
  var postsView={
    find: {},
    sort: {submitted: -1},
    postsPerPage: postsPerPage,
    limit: postsPerPage,
    page: pageNumber,
    skip:0
  }
  sessionSetObject('postsView', postsView);
}

Template.posts_new.events({
  'click button.more': function() {
    var postsView=sessionGetObject('postsView');
    postsView.postsPerPage+=postsView.postsPerPage;
    postsView.pageNumber++;
    sessionSetObject('postsView', postsView);
  },
  'click .next-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    postsView.page++;
    postsView.skip=(postsView.page-1)*postsView.postsPerPage
    console.log("now showing page: "+postsView.page);
    sessionSetObject('postsView', postsView);
  },
  'click .prev-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    if(postsView.page>1){
      postsView.page--;
      postsView.skip=(postsView.page-1)*postsView.postsPerPage
      // console.log("now showing page: "+postsView.page);
      sessionSetObject('postsView', postsView);
    }
  }
});
