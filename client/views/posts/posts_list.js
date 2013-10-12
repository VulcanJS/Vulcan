Template.posts_list.helpers({
  posts: function() {
    // console.log(Router.current().waitOn[0])
    return Router.current().waitOn[0].fetch();
  },
  postsReady: function() {
    return Router.current().waitOn[0].ready();
  },
  allPostsLoaded: function(){
    allPostsLoaded = Router.current().waitOn[0].fetch().length < Router.current().waitOn[0].loaded();
    Session.set('allPostsLoaded', allPostsLoaded);
    return allPostsLoaded;  
  }
});

Template.posts_list.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
}

Template.posts_list.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    Router.current().waitOn[0].loadNextPage();
  }
});

