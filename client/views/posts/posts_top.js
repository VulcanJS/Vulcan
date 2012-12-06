Template.posts_top.posts = function() {
  return topPosts();
};

Template.posts_top.helpers({
  postsReady: function() {
    return ! topPostsHandle.loading();
  },
  allPostsLoaded: function(){
    return topPosts().length < topPostsHandle.loaded()
  }
});

Template.posts_top.rendered = function(){
    var distanceFromTop = 0;
    $('.post').each(function(){
      distanceFromTop += $(this).height();
    });
    $('body').css('min-height',distanceFromTop+160);
    $('.more-button').css('top', distanceFromTop+"px");  
}

Template.posts_top.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    topPostsHandle.loadNextPage();
  }
});

