Template.posts_top.posts = function(){
  return Posts.find();
};

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

