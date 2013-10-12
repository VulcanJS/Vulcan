Template.posts_list.helpers({
  posts: function() {
    return currentSubscription.fetch();
  },
  postsReady: function() {
    return currentSubscription.ready();
  },
  allPostsLoaded: function(){
    allPostsLoaded = currentSubscription.fetch().length < currentSubscription.loaded();
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
    currentSubscription.loadNextPage();
  }
});

