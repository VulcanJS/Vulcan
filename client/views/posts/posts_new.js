Template.posts_new.posts = function(){
  return Posts.find();
};

Template.posts_new.helpers({
  moreLinkDistance: function(){
    return (Posts.find().count()+1)*80;
  },
  allPostsLoaded: function(){
    var postsView=sessionGetObject('postsView');
    return Posts.find().count() < postsView.skip + postsView.limit;
  }
});

Template.posts_new.events({
  'click .more-link': function(e) {
    e.preventDefault();
    var postsView=sessionGetObject('postsView');
    postsView.limit+=postsView.postsPerPage;
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
