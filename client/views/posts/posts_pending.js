Template.posts_pending.posts = function() {
  return pendingPosts();
};

Template.posts_pending.helpers({
  allPostsLoaded: function(){
    return pendingPosts().length < Session.get('newPageLimit');
  }
});

Template.posts_pending.rendered = function(){
    var distanceFromTop = 0;
    $('.post').each(function(){
      distanceFromTop += $(this).height();
    });
    $('.more-button').css('top', distanceFromTop+"px");
}

Template.posts_pending.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    Session.set('newPageLimit', Session.get('newPageLimit') + NEW_PAGE_PER_PAGE)
  }
});
