Template.posts_best.posts = function() {
  return postsForSub.bestPosts();
};

Template.posts_best.helpers({
  allPostsLoaded: function(){
    return postsForSub.bestPosts().length < Session.get('bestPostsLimit');
  }
});

Template.posts_best.rendered = function(){
    var distanceFromTop = 0;
    $('.post').each(function(){
      distanceFromTop += $(this).height();
    });
    $('body').css('min-height',distanceFromTop+160);
    $('.more-button').css('top', distanceFromTop+"px");  
}

Template.posts_best.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    Session.set('bestPostsLimit', Session.get('bestPostsLimit') + BEST_PAGE_PER_PAGE);
  }
});

