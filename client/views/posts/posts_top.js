Template.posts_top.posts = function() {
  return topPosts();
};

Template.posts_top.helpers({
  allPostsLoaded: function(){
    return topPosts().length < Session.get('topPageLimit');
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
    Session.set('topPageLimit', Session.get('topPageLimit') + TOP_PAGE_PER_PAGE);
  }
});

